cordova.define("com.adobe.phonegap.push.PushPlugin", function (require, exports, module) {
    var myApp = {};
    module.exports = {
        init: function (success, fail, args) {
            var onNotificationReceived = function (e) {
                var result = {};
                result.message = JSON.stringify(e);
                success(result, { keepCallback: true});
            };
           
            Windows.Networking.PushNotifications.PushNotificationChannelManager.createPushNotificationChannelForApplicationAsync().done(
                function (channel) {
                    var result = {};
                    result.registrationId = channel.uri;
                    myApp.channel = channel;
                    channel.addEventListener("pushnotificationreceived", function(e) {
                        onNotificationReceived(e);
                    });
                    success(result, { keepCallback: true });
                }, function (error) {
                    fail(error);
                });
        },
        unregister: function (success, fail, args) {
            try {
                myApp.channel.close();
                success();
            } catch(ex) {
                fail(ex);
            }
        }
    };
require("cordova/exec/proxy").add("PushNotification", module.exports);

});
