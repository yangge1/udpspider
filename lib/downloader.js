const bencode=require('bencode');
var net =require('net');
var Node=require('./table').Node;
var BT_PROTOCOL = "BitTorrent protocol",
BT_MSG_ID = 20,
EXT_HANDSHAKE_ID = 0;
function send_handshake(client,infohash){
    var bt_header=String.fromCharCode(BT_PROTOCOL.length);
    var ext_bytes = "\u0000\u0000\u0000\u0000\u0000\u0010\u0000\u0000";
    var peer_id=Node.generateID();
    var packet = bt_header + ext_bytes + infohash + peer_id;
}
function check_handshake(packet,infohash){
    var bt_header_len=packet.codePointAt(0);
    var packet=packet.slice(1);
    if(bt_header_len!==BT_PROTOCOL.length){
        return false;
    }
    var bt_header=packet.slice(0,bt_header_len);
    packet=packet.slice(bt_header_len);
    if(bt_header!==BT_PROTOCOL){
        return false;
    }
    packge=packge.slice(8);
    infohash=packge.slice(0,20);
    if(infohash!==self_infohash){
        return false;
    }
    return true;
}
function send_message(client,msg){

}
function send_ext_handshake(client){
    var msg=String.fromCodePoint(BT_MSG_ID)+String.fromCodePoint(EXT_HANDSHAKE_ID)+bencode({"m":{"ut_metadata": 1}})
    send_message(client, msg);
}
module.exports=function(address,infohash){
    var client=new net.Socket();
    client.connect(address.port,address.address,function(){
        console.log('CONNECTED TO: ' + address.port + ':' + address.address);
        send_handshake(client, infohash)

    })
    client.on('data', function(packet) {

        console.log('DATA: ' + packet);
        if(!check_handshake(packet, infohash)) return;
        send_ext_handshake(client);
        // 完全关闭连接
      //  client.destroy();
    
    });
    client.on('close', function() {
        console.log('Connection closed');
    });
}