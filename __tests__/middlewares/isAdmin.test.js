const isAdmin = require("../../middlewares/auth/isAdmin");

describe("isAdmin Middleware", () => {
  it("should call next() if user is logged in and is admin", () => {
    const req = {
      session: {
        user: { isAdmin: true }
      }
    };
    const res = {};
    const next = jest.fn();

    isAdmin(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it("should redirect to login if user is not logged in", () => {
    const req = { session: {} };
    const res = {
      redirect: jest.fn()
    };
    const next = jest.fn();

    isAdmin(req, res, next);

    expect(res.redirect).toHaveBeenCalledWith("/auth/login");
    expect(next).not.toHaveBeenCalled();
  });

  it("should redirect to login if user is not admin", () => {
    const req = {
      session: {
        user: { isAdmin: false }
      }
    };
    const res = {
      redirect: jest.fn()
    };
    const next = jest.fn();

    isAdmin(req, res, next);

    expect(res.redirect).toHaveBeenCalledWith("/auth/login");
    expect(next).not.toHaveBeenCalled();
  });
});
