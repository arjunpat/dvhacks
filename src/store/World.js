import AgoraRTM from 'agora-rtm-sdk';

function send(json) {

}


class World {
  constructor(world_uid) {
    this.userMap = {};
    this.worldUid = world_uid;   
  }

  handleMessage(data) {
    if (data.type === 'user') {
      if (this.userMap[data.uid]) {
        if (this.locationChangeHandler)
          this.locationChangeHandler(data);
      } else {
        if (this.userJoinHandler)
          this.userJoinHandler(data);
      }
      this.userMap[data.uid] = data;
    }
  }

  move(x, y) {

  }

  init(uid) {
    return new Promise((resolve, reject) => {
      this.messagingClient = AgoraRTM.createInstance('4b7e608f84004ea2acd537eda95f6bf8');

      this.messagingClient.on('ConnectionStateChanged', (newState, reason) => {
        console.log('on connection state changed to ' + newState + ' reason: ' + reason);
      });

      this.messagingClient.login({ token: null, uid: `${uid}` }).then(() => {
        console.log('AgoraRTM client login success');

        this.channel = this.messagingClient.createChannel(this.worldUid);

        this.channel.join().then(() => {
          console.log("You joined channel successfully");
          resolve();
        }).catch(error => {
          console.log("Failure to join channel: " + error);
        });

        this.channel.on('ChannelMessage', ({ text }, senderId) => {
          console.log(text + " from " + senderId);
        });
      }).catch(err => {
        console.log('AgoraRTM client login failure', err);
      });
    });
  }

  join(uid, username, videoTrack, audioTrack, x, y) {
    this.me = {
      type: 'user',
      uid,
      username,
      videoTrack,
      audioTrack,
      x,
      y
    };
  }

  onLocationChange(func) {
    this.locationChangeHandler = func;
  }

  onUserJoin(func) {
    this.userJoinHandler = func;
  }


}

/* message types

{
  type: 'user',
  uid: 'afwhuuwaiaw83f89j3',
  username: 'Arjun Patrawala',
  videoTrack: 'adsf',
  audioTrack: 'asdfa',
  x: 50,
  y: 90
}

*/

export default World;