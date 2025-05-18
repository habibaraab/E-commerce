const isUser = require("../../middlewares/auth/isUser");

describe("isUser Middleware", () => {
  it("should call next() if user is logged in and not admin", () => {
    const req = {
      session: {
        user: { isAdmin: false }
      }
    };
    const res = {};
    const next = jest.fn();

    isUser(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it("should redirect to login if user is not logged in", () => {
    const req = { session: {} };
    const res = {
      redirect: jest.fn()
    };
    const next = jest.fn();

    isUser(req, res, next);

    expect(res.redirect).toHaveBeenCalledWith("/auth/login");
    expect(next).not.toHaveBeenCalled();
  });

  it("should redirect to login if user is admin", () => {
    const req = {
      session: {
        user: { isAdmin: true }
      }
    };
    const res = {
      redirect: jest.fn()
    };
    const next = jest.fn();

    isUser(req, res, next);

    expect(res.redirect).toHaveBeenCalledWith("/auth/login");
    expect(next).not.toHaveBeenCalled();
  });
});
