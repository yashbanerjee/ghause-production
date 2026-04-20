// SmtpJS.com - v3.0.0 integration
export interface EmailConfig {
    Host?: string;
    Username?: string;
    Password?: string;
    To?: string;
    From?: string;
    Subject?: string;
    Body?: string;
    Token?: string;
    [key: string]: any;
}

export const Email = {
    send: function (a: EmailConfig): Promise<string> {
        return new Promise(function (b, c) {
            a.nocache = Math.floor(1e6 * Math.random() + 1);
            a.Action = "Send";
            var d = JSON.stringify(a);
            Email.ajaxPost("https://smtpjs.com/v3/smtp.js", d, function (e: string) {
                b(e);
            });
        });
    },
    ajaxPost: function (a: string, b: string, c: ((res: string) => void) | null) {
        var d = Email.createCORSRequest("POST", a);
        if (d) {
            d.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            d.onload = function () {
                var a = d.responseText;
                if (c != null) c(a);
            };
            d.send(b);
        }
    },
    ajax: function (a: string, b: ((res: string) => void) | null) {
        var c = Email.createCORSRequest("GET", a);
        if (c) {
            c.onload = function () {
                var a = c.responseText;
                if (b != null) b(a);
            };
            c.send();
        }
    },
    createCORSRequest: function (a: string, b: string): XMLHttpRequest | null {
        var c: any = new XMLHttpRequest();
        if ("withCredentials" in c) {
            c.open(a, b, true);
        } else if (typeof (window as any).XDomainRequest != "undefined") {
            c = new (window as any).XDomainRequest();
            c.open(a, b);
        } else {
            c = null;
        }
        return c;
    }
};

