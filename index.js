var uuid = require('uuid/v1');

var rooms = new Map();

module.exports = {

    find: function(id) {
        return rooms.get(id);
    },

    list: function () {
      return Array.from(rooms.keys());
    },

    join: function(id = undefined, socket) {
        if (id === undefined) {
            id = uuid();
        }

        var room = rooms.get(id);

        if (!room) {
            room = {};
            room.id = id;
            room.sockets = {};
            rooms.set(id,room);
        }

        room.sockets[socket.id]=socket;
        socket.room = id;

    },

    friends: function (roomId,socket){
        const sockets = rooms.get(roomId).sockets;
        var friends = Object.assign({}, sockets);
        delete friends[socket.id];
        return friends;
    },

    leave: function(socket) {
        if (socket.room) {
            var room = rooms.get(socket.room);

            if (room) {
                delete room.sockets[socket.id];

                if (!room.sockets || Object.getOwnPropertyNames(room.sockets).length == 0) {

                    rooms.delete(socket.room);

                }
            }
            delete socket['room'];
        }
    }
};
