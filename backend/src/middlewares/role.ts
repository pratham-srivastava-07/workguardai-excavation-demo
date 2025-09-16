import { getUserRole } from "../services/user";

export default function requireRole(roles: string[]) {
  return async function (req: any, res: any, next: any): Promise<any> {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const role = await getUserRole(req.user.id);

      if (!role || !roles.includes(role)) {
        return res.status(403).json({ error: "Access denied" });
      }

      // attach the verified role to request for downstream use
      req.user.role = role;
      next();
    } catch (err) {
      return res.status(500).json({ error: "Internal server error" });
    }
  };
}
