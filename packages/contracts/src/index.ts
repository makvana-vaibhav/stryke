export type Environment = "dev" | "staging" | "production";

export interface DeploymentRequest {
  repositoryUrl: string;
  branch: string;
  serverId: string;
  domain: string;
  environment: Environment;
}

export type DeploymentStatus =
  | "queued"
  | "running"
  | "success"
  | "failed";
