/**
 * Role-based access matrix (enforced in routes via authorize()).
 *
 * | Capability              | viewer | analyst | admin |
 * |-------------------------|--------|---------|-------|
 * | List / read records     |   ✓    |    ✓    |   ✓   |
 * | Dashboard summaries     |   ✓    |    ✓    |   ✓   |
 * | Create / delete records |   ✗    |    ✗    |   ✓   |
 * | List / update users     |   ✗    |    ✗    |   ✓   |
 * | Register users (API)    |   ✗    |    ✗    |   ✓   |
 * | Public sign-up          |  (open POST /auth/signup — viewer or analyst only)
 */
const ROLES = Object.freeze({
  VIEWER: 'viewer',
  ANALYST: 'analyst',
  ADMIN: 'admin',
});

const RECORD_READ_ROLES = [ROLES.VIEWER, ROLES.ANALYST, ROLES.ADMIN];
const RECORD_WRITE_ROLES = [ROLES.ADMIN];
const USER_ADMIN_ROLES = [ROLES.ADMIN];

module.exports = {
  ROLES,
  RECORD_READ_ROLES,
  RECORD_WRITE_ROLES,
  USER_ADMIN_ROLES,
};
