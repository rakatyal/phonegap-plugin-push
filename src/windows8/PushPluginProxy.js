cordova.define("com.adobe.phonegap.push.PushPlugin", function (require, exports, module) {
    var myApp = {};
    var pushNotifications = Windows.Networking.PushNotifications;

    module.exports = {
        init: function (onSuccess, onFail, args) {

            var onNotificationReceived = function (e) {
                var result = {};
                var notificationPayload;

                switch (e.notificationType) {
                    case pushNotifications.PushNotificationType.toast:
                        notificationPayload = e.toastNotification.content;
                        break;

                    case pushNotifications.PushNotificationType.tile:
                        notificationPayload = e.tileNotification.content;
                        break;

                    case pushNotifications.PushNotificationType.badge:
                        notificationPayload = e.badgeNotification.content;
                        break;

                    case pushNotifications.PushNotificationType.raw:
                        notificationPayload = e.rawNotification.content;
                        break;
                }
                result.message = JSON.stringify(notificationPayload);
                onSuccess(result, { keepCallback: true });
            };

            pushNotifications.PushNotificationChannelManager.createPushNotificationChannelForApplicationAsync().done(
                function (channel) {
                    var result = {};
                    result.registrationId = channel.uri;
                    myApp.channel = channel;
                    channel.addEventListener("pushnotificationreceived", onNotificationReceived);
                    myApp.notificationEvent = onNotificationReceived;
                    onSuccess(result, { keepCallback: true });
                }, function (error) {
                    onFail(error);
                });
        },
        unregister: function (onSuccess, onFail, args) {
            try {
                myApp.channel.removeEventListener("pushnotificationreceived", myApp.notificationEvent);
                myApp.channel.close();
                onSuccess();
            } catch(ex) {
                onFail(ex);
            }
        }
    };
require("cordova/exec/proxy").add("PushNotification", module.exports);

});
