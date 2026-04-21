const API = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

/* =====================================================
   COMMON REQUEST FUNCTION
===================================================== */

async function request(endpoint: string, method = "GET") {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  const res = await fetch(`${API}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(
      `API Error ${res.status}: ${errorText || res.statusText}`
    );
  }

  return res.json();
}

/* =====================================================
   🔥 DASHBOARD (MAIN)
===================================================== */

export const fetchOverview = () =>
  request("/dashboard/overview");

/* =====================================================
   🔥 EC2
===================================================== */

export const fetchEC2 = async () => {
  const data = await request("/aws/ec2/");
  return data.instances || [];
};

export const syncEC2 = () =>
  request("/aws/ec2/sync", "POST");

/* =====================================================
   🔥 S3
===================================================== */

export const fetchS3 = async () => {
  const data = await request("/aws/s3/");
  return data.buckets || [];
};

export const syncS3 = () =>
  request("/aws/s3/sync", "POST");

/* =====================================================
   🔥 RDS
===================================================== */

export const fetchRDS = async () => {
  const data = await request("/aws/rds/");
  return data.instances || [];
};

export const syncRDS = () =>
  request("/aws/rds/sync", "POST");

/* =====================================================
   🔥 LAMBDA
===================================================== */

export const fetchLambda = async () => {
  const data = await request("/aws/lambda/");
  return data.functions || [];
};

export const syncLambda = () =>
  request("/aws/lambda/sync", "POST");

/* =====================================================
   🔥 RISK
===================================================== */

export const fetchRiskScore = () =>
  request("/aws/risk/");

export const fetchRiskTrend = () =>
  request("/aws/risk/trend");






/* =====================================================
   🔥 INFRASTRUCTURE (COMBINED)
===================================================== */

export const fetchInfrastructure = async () => {
  const [ec2, s3, rds, lambda] = await Promise.all([
    fetchEC2(),
    fetchS3(),
    fetchRDS(),
    fetchLambda(),
  ]);

  /* ================= EC2 ================= */

  const instances = ec2.map((i: any) => ({
    id: i.id,
    type: i.type,
    state: i.state,
    cpu: i.cpu || 0,
    cost: i.cost || 0,
    risk: i.risk || "OPTIMAL",
  }));

  const running = instances.filter((i: any) => i.state === "running").length;
  const stopped = instances.filter((i: any) => i.state === "stopped").length;

  /* ================= S3 ================= */

  const buckets = s3.map((b: any) => ({
    name: b.name,
    size: b.size_bytes,
    objects: b.object_count,
    cost: b.estimated_cost,
  }));

  /* ================= RDS ================= */

  const databases = rds.map((db: any) => ({
    id: db.id,
    engine: db.engine,
    storage: db.storage,
    cost: db.cost,
    risk: db.risk,
  }));

  /* ================= LAMBDA ================= */

  const functions = lambda.map((fn: any) => ({
    name: fn.name,
    runtime: fn.runtime,
    memory: fn.memory,
    timeout: fn.timeout,
    invocations: fn.invocations,
    risk: fn.risk,
  }));

  /* ================= TOTAL COST ================= */

  const totalCost =
    instances.reduce((a: number, i: any) => a + i.cost, 0) +
    buckets.reduce((a: number, b: any) => a + b.cost, 0) +
    databases.reduce((a: number, d: any) => a + d.cost, 0);

  /* ================= INSIGHTS ================= */

  const insights: string[] = [];

  if (stopped > 0) {
    insights.push(`⚠ ${stopped} EC2 instances are idle`);
  }

  const unusedLambda = functions.filter((f: any) =>
    (f.risk || "").includes("UNUSED")
  ).length;

  if (unusedLambda > 0) {
    insights.push(`⚠ ${unusedLambda} unused Lambda functions`);
  }

  if (databases.some((d: any) => (d.risk || "") !== "HEALTHY")) {
    insights.push(`⚠ Some RDS instances need attention`);
  }

  if (insights.length === 0) {
    insights.push("✅ Infrastructure is optimized");
  }

  /* ================= EFFICIENCY ================= */

  const efficiency = Math.max(
    100 - (stopped * 10 + unusedLambda * 5),
    50
  );

  return {
    summary: {
      total_instances: instances.length,
      running_instances: running,
      stopped_instances: stopped,
      total_cost: totalCost,
      efficiency,
    },

    ec2: instances,
    s3: buckets,
    rds: databases,
    lambda: functions,
    insights,
  };
};
