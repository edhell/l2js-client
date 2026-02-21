/**
 * Use this example.js file as you wish - it's just a simple demo of how to ue the l2js-client library
 *
 * It is configured to connect to Lineage2 Idle server with a temp account:
 * username: l2js
 * password: passwd
 *
 * If you want, feel free to use this account for testing purposes
 */
const process = require("process");

const readline = require("readline");
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

const Client = require("./dist/Client").default;

process.stdout.write("\u001b[3J\u001b[2J\u001b[1J");
console.clear();

var l2 = new Client();
l2.enter({
  /* required */ Username: "ed3",
  /* required */ Password: "ed",
  /* required */ Ip: "192.168.15.10",
  /* optional */ ServerId: 1, //Bartz 
  /* optional */ CharSlotIndex: 0,
}).then(() => {
  l2.on("PacketReceived:ShortCutInit", () => {
    l2.say("Hello from " + l2.Me.Name);
    l2.autoShots(1467, true); // enable SSS
  })
    .on("PacketReceived:CreatureSay", (packet) => {
      // var x = 50 + Math.floor(Math.random() * 50) + l2.Me.X;
      // var y = 50 + Math.floor(Math.random() * 50) + l2.Me.Y;
      // var z = l2.Me.Z;
      // l2.moveTo(x, y, z);
      //console.log(l2.NpcInfo.keys());
    })

    .on("PacketReceived:AskJoinParty", (packet) => {
      l2.acceptJoinParty();
    })

    .on("PacketReceived:ItemList", (packet) => {
      //console.log(l2.InventoryItems);
    })

    .on("RequestedDuel", (event) => {
      console.log(`A duel has been requested by ${event.data}`);
    })

    .on("Attacked", (event) => {
      if (Array.from(event.data.subjects).includes(l2.Me.ObjectId)) {
        console.log(`I am attacked by ${event.data.object}!!!`);
        l2.hit(event.data.object);
        l2.hit(event.data.object);
      }

      // let creature = l2.CreaturesList.getEntryByObjectId(event.data.object);
      // if (creature && creature.Target && creature.Name === "Adm") {
      //   l2.hit(creature.Target);
      //   l2.hit(creature.Target);
      // }
    });
}).catch(e => console.log(e));


var autoAttack = false;
var follow = false;
// Follow
l2.on("StartMoving", ({ data }) => {
  if (follow && data.creature.Name === "Adm") {
    l2.moveTo(data.Dx, data.Dy, data.Dz);
  }
});

l2.on("Die", ({ data }) => {
  if (l2.Me.Target && data.creature.ObjectId === l2.Me.Target.ObjectId) {
    l2.cancelTarget();
  }
});

// 51.77.56.145

process.stdin.on("keypress", (str, key) => {
  if (key.ctrl && key.name === "c") {
    process.exit();
  } else if (key.ctrl && key.name === "z") {
    process.stdout.write("\u001b[3J\u001b[2J\u001b[1J");
    console.clear();
  } else {
    console.log(`You pressed the "${key.name}" key`);

    switch (key.name) {
      case "x":
        console.log(l2.Me);
        break;
      case "c":
        console.log(l2.CreaturesList);
        break;
      case "f3":
        console.log(l2.PartyList);
        break;
      case "f4":
        console.log(l2.DroppedItems);
        break;
      case "f5":
        console.log(l2.BuffsList);
        break;
      case "f6":
        console.log(l2.SkillsList);
        break;
      case "escape":
        l2.cancelTarget();
        break;
      case "space":
        var i = l2.DroppedItems.closest();
        if (i) {
          l2.hit(i);
        }
        break;
      case "f11":
        l2.hit(Array.from(l2.CreaturesList)[1].ObjectId);
        break;
      case "f12":
        l2.nextTarget();
        break;
      case "tab":
        l2.inventory();
        break;
      case "return":
        var npc = l2.Me.Target;
        if (npc) {
          l2.hit(npc.ObjectId);
        }
        break;
      case "d":
        l2.requestDuel("Adm");
        break;
      case "f":
        follow = !follow;
        break;
      case "a":
        autoAttack = !autoAttack;
        break;
      case "s":
        l2.sitOrStand();
        break;
      case "up":
        l2.moveTo(l2.Me.X + 50, l2.Me.Y, l2.Me.Z);
        break;
      case "down":
        l2.moveTo(l2.Me.X - 50, l2.Me.Y, l2.Me.Z);
        break;
      case "left":
        l2.moveTo(l2.Me.X, l2.Me.Y + 50, l2.Me.Z);
        break;
      case "right":
        l2.moveTo(l2.Me.X, l2.Me.Y - 50, l2.Me.Z);
        break;
    }
  }
});

setInterval(() => {
  if (autoAttack && l2.Me.Target == null) {
    l2.nextTarget();
    setTimeout(() => l2.hit(l2.Me.Target), 100);
    setTimeout(() => l2.hit(l2.Me.Target), 100);
  }
}, 500);
