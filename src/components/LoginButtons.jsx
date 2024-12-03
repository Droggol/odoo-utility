import React from "react";

function LoginButtons({ showCustomBtn, customBtnUsername, customBtnPassword, callback }) {
    return (
        <div className="form-group mb-3 text-center">
            <div className="small mb-1">Login as</div>
            <div className="btn-group btn-group-sm">
                {showCustomBtn && customBtnUsername && customBtnPassword &&
                    <a href="#" onClick={
                        () => callback(customBtnUsername, customBtnPassword)
                    } className="btn btn-primary" data-username={customBtnUsername} data-password={customBtnPassword} title={`Login as ${customBtnUsername} user`}>{customBtnUsername}</a>
                }
                <a href="#" onClick={() => callback("admin", "admin")} className="btn btn-primary" data-username="admin" data-password="admin" title="Login as admin user">Admin</a>
                <a href="#" onClick={() => callback("demo", "demo")} className="btn btn-primary" data-username="demo" data-password="demo" title="Login as demo user">Demo</a>
                <a href="#" onClick={() => callback("portal", "portal")} className="btn btn-primary" data-username="portal" data-password="portal" title="Login as portal user">Portal</a>
            </div>
        </div>
    )
}

export default LoginButtons;
