import http from "k6/http";
import { check, sleep, group } from "k6";

export const options = {
  vus: 5,
  duration: "30s",
  thresholds: {
    http_req_failed: ["rate<0.01"],       // <1% failures
    http_req_duration: ["p(95)<800"],     // 95% < 800ms
    checks: ["rate>0.99"],                // 99% checks must pass
  },
};

export default function () {
  const base = __ENV.BASE_URL || "http://17313-team20.s3d.cmu.edu:4567";

  group("GET / (homepage HTML)", () => {
    const r = http.get(`${base}/`);
    check(r, {
      "status 200": (res) => res.status === 200,
      "has HTML":   (res) => String(res.headers["Content-Type"] || "").includes("text/html"),
    });
  });

  group("GET /api/ (NodeBB JSON root)", () => {
    const r = http.get(`${base}/api/`);
    check(r, {
      "status 200": (res) => res.status === 200,
      "is JSON":    (res) => String(res.headers["Content-Type"] || "").includes("application/json"),
    });
  });

  group("GET /api/config (public config)", () => {
    const r = http.get(`${base}/api/config`);
    check(r, {
      "status 200": (res) => res.status === 200,
      "is JSON":    (res) => String(res.headers["Content-Type"] || "").includes("application/json"),
    });
  });

  sleep(1);
}
