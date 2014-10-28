var storage = {

    initialize: function(arr) {
        this.storeSnow(arr);
    },

    /* location preference storage */
    isLocationSet: function() {
        return (localStorage.getItem("locationFlag"));
    },
    setLocation: function(pref) {
        localStorage.setItem("locationFlag", true);
        localStorage.setItem("location", pref);
    },
    getLocation: function() {
        if(storage.isLocationSet)
            return localStorage.getItem("location");
        else 
            return "Location preferences were not set.";
    },

    removePref: function() {
        localStorage.setItem("location", false);
        localStorage.setItem("locationFlag", false);
        localStorage.setItem("alarm", false);
        localStorage.setItem("alarmFlag", false);
    },

    /* alarm preference storage */
    isAlarmSet: function() {
        return (localStorage.getItem("alarmFlag"));
    },

    setAlarm: function(pref) {
        localStorage.setItem("alarm", pref);
        localStorage.setItem("alarmFlag", true);
    },

    getAlarm: function() {
        if(storage.isAlarmSet)
            return localStorage.getItem("alarm");
        else 
            return "Alarm preferences were not set.";
    },

    /* last 2h snow-depth storage - for Rogers Park & Lincoln Park */
    isSnowStore: function() {
        return (localStorage.getItem("snowFlag"));
    },

    storeSnow: function(depthArr) {
        localStorage.setItem("snowFlag", true);
        localStorage.setItem("snowDepth", depthArr );
    },

    getSnow: function() {
        if(storage.isSnowStore)
            return localStorage.getItem("snowDepth");
        else 
            return "Snow depth were not store.";
    },

    removeSnow: function() {
        localStorage.setItem("snowDepth", false);
        localStorage.setItem("snowFlag", false);
    }

}