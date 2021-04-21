import Peer from "https://cdn.skypack.dev/peerjs@1.3.2";

var p = new Peer();
var c;
var peerName = "Them";
var clientName = "You";

p.on("open", function (id) {
    addMsg("Your peer ID is: " + id);
});

document.getElementById("peerSubmitBtn").addEventListener("click", function () {
    c = p.connect(document.getElementById("peer").value);
    addMsg("Trying to connect to the network");
    c.on("open", () => {
        c.on("data", (data) => {
            var nameUpdate = data.search("update name to ");
            if (nameUpdate != -1) {
                if (peerName != "Them") {
                    addMsg(
                        peerName +
                            " updated their name to " +
                            data.slice(nameUpdate + 15).replace(/\s+/g, "")
                    );
                }
                peerName = data.slice(nameUpdate + 15).replace(/\s+/g, "");
            } else {
                addMsg(peerName + ": " + data);
            }
        });
        addMsg("Successfully connected to the network");
        document.getElementById("peerWrapper").style.display = "none";
        document.getElementById("nameWrapper").style.display = "block";
        document
            .getElementById("chatSubmitBtn")
            .addEventListener("click", function () {
                if (c.open) {
                    var msg = document.getElementById("chat").value;
                    c.send(msg);
                    addMsg(clientName + ": " + msg);
                }
            });
        document
            .getElementById("nameSubmitBtn")
            .addEventListener("click", function () {
                if (c.open) {
                    clientName = document
                        .getElementById("name")
                        .value.replace(/\s+/g, "");
                    var msg = "update name to " + clientName;

                    c.send(msg);
                    document.getElementById("nameWrapper").style.display =
                        "none";
                    document.getElementById("chatWrapper").style.display =
                        "block";
                }
            });
    });
});

p.on("connection", (conn) => {
    document.getElementById("peerWrapper").style.display = "none";
    document.getElementById("nameWrapper").style.display = "block";
    conn.on("data", (data) => {
        var nameUpdate = data.search("update name to ");
        if (nameUpdate != -1) {
            if (peerName != "Them") {
                addMsg(
                    peerName +
                        " updated their name to " +
                        data.slice(nameUpdate + 15).replace(/\s+/g, "")
                );
            }
            peerName = data.slice(nameUpdate + 15).replace(/\s+/g, "");
        } else {
            addMsg(peerName + ": " + data);
        }
    });
    document
        .getElementById("nameSubmitBtn")
        .addEventListener("click", function () {
            if (conn.open) {
                clientName = document
                    .getElementById("name")
                    .value.replace(/\s+/g, "");
                var msg = "update name to " + clientName;

                conn.send(msg);
                document.getElementById("nameWrapper").style.display = "none";
                document.getElementById("chatWrapper").style.display = "block";
            }
        });
    document
        .getElementById("chatSubmitBtn")
        .addEventListener("click", function () {
            if (conn.open) {
                var msg = document.getElementById("chat").value;
                conn.send(msg);
                addMsg(clientName + ": " + msg);
            }
        });
});

function addMsg(msg) {
    var node = document.createElement("li");
    node.innerHTML = msg;
    document.getElementById("msgList").appendChild(node);
}
