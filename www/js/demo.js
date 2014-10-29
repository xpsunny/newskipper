var demo = {

    mode: 0,
    first: 0,
    sec: 0,

    initialize: function( mode ) {
        //mode: 0-web, 1-phonegap
        this.mode = mode;
        
        this.refreshStorage();
        setInterval("demo.check_weather()", 1000);
        this.index_message();

        $('#logo').click( function() {
            $('#back_run_test2').toggle();
        });

        $('#back_run_test2').html(
            '<button onclick="storage.setLocation(\'Evanston, IL\'); demo.index_message();"> Evanston </button>' +
            '<button onclick="storage.setLocation(\'Rogers Park, IL\'); demo.index_message();"> Rogers Park </button>' +
            '<button onclick="storage.setLocation(\'Skokie, IL\'); demo.index_message();"> Skokie </button>' +
            '<button onclick="storage.setLocation(\'Lincoln Park, IL\'); demo.index_message();"> Lincoln Park </button><br/>' +
            '<button onclick="demo.notification();"> Trigger </button>'
        ).hide();
    },

    index_message: function() {
        $('#show_temperature').show().html('');
        $('#user_notification').show().html('');
        this.retrieveData( 8, storage.getLocation(), function(data){
            $.each(data, function( index, value ){
                var snow = value['snow_depth'];
                if (index==0) {
                    $('#show_temperature').append("<strong>Snow right now: "  + snow + " in."+ '</strong><br/>');
                        if (snow<2) {
                        $('#user_notification').prepend("<p id='note'>No need to panic. Keep your car right where it is.  <a id='data_drop' onclick='showData(); return false;'>&#187</a></p>");
                    } else if (snow >= 2) {
                        $('#user_notification').prepend("<p id='note'>Move your car off the street before 8am!<a id='data_drop' onclick='showData(); return false;'>&#187</a></p>");
                    }
                } else {
                    $('#show_temperature').hide();
                    if (index==1) {
                        hour = "hour";
                    } else {
                        hour = "hours";
                    }
                    $('#show_temperature').append(index + " " + hour + " ago:  " + snow +  " in."+ '<br/>');
                }
            });
            $('#show_temperature').append("<a id='go_back' onclick='hideData(); return false;'>&#171;</a>");
        });
    },

    check_weather: function() {
        var dt = new Date(15,0,13,7,0,this.sec,0); 
        //var myDate = (dt.getMonth()+1) + "-" + dt.getDate();
        var myDate = 'Jan 13 2015';
        var myTime = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
        var myMin = dt.getHours() + ":" + dt.getMinutes();
        var mySec = dt.getSeconds();

        $('#back_run_test').html( "<p>" + myDate + "</p> <p> "  + myTime + "</p>");

        //if (mySec == 5) { //once a min
            this.refreshStorage();
        //}

        this.sec += 1;
    },

    notification: function() {

            if (storage.getLocation() == 'Evanston, IL' || storage.getLocation() == 'Skokie, IL') {
                // evanston & skokie @ 7:00; 2inch. overnigh

                var data = JSON.parse(storage.getSnow()), move_car = 0;

                if( data[0] > 2 )
                    move_car = 1;

                if(move_car) {
                    if(storage.getAlarm()) {
                        if (this.mode) {
                            window.plugin.notification.local.add({ 
                                message: "Snow over 2 inches! Move your car now!",
                                    sound: 'TYPE_ALARM' });
                        } else 
                            alert("Snow over 2 inches! Move your car now!");
                    } else {
                        if (this.mode) {
                            window.plugin.notification.local.add({ 
                            message: "Snow over 2 inches! Move your car now!" });
                        } else 
                            alert("Snow over 2 inches! Move your car now!");
                    }
                }
            } else if (storage.getLocation() == 'Rogers Park, IL' || storage.getLocation() == 'Lincoln Park, IL') {
                // only notification(11/30) @ 5pm - parking ban starts 12/1->4/1 3am~7am
                // lincon park & rogers park (recent 4inches), push right away(45 mins); check behind 2 hours;

                if(storage.getAlarm()) {
                        if (this.mode) {
                            window.plugin.notification.local.add({ 
                                message: "Snow over 2 inches! Move your car now!",
                                sound: 'TYPE_ALARM' });
                        } else 
                            alert("Snow over 2 inches! Move your car now!");
                    } else {
                        if (this.mode) {
                            window.plugin.notification.local.add({ 
                                message: "Snow over 2 inches! Move your car now!" });
                        } else 
                            alert("Snow over 2 inches! Move your car now!");
                    }

                var data = JSON.parse(storage.getSnow()), move_car = 0;

                if ( myDate == "11-30" && !this.first) {
                    if (this.mode) {
                        window.plugin.notification.local.add({ 
                                message: "No parking 3AM-7AM, DEC 1 - APR 1"});
                    }
                    else
                        alert("No parking 3AM-7AM, DEC 1 - APR 1");
                    this.first = 1;
                }

                /*if( data[2] > 2 ||  data[3] > 2 )
                    move_car = 1;

                if(move_car) {
                    if(storage.getAlarm()) {
                        if (this.mode) {
                            window.plugin.notification.local.add({ 
                                message: "Snow over 2 inches! Move your car now!",
                                sound: 'TYPE_ALARM' });
                        } else 
                            alert("Snow over 2 inches! Move your car now!");
                    } else {
                        if (this.mode) {
                            window.plugin.notification.local.add({ 
                                message: "Snow over 2 inches! Move your car now!" });
                        } else 
                            alert("Snow over 2 inches! Move your car now!");
                    }
                }*/
            } else {
                $('#back_run_test3').text('smth wrong');
            }
    },

    refreshStorage: function() {
        var data, out_strings = JSON.parse( storage.getSnow() );

        if ( storage.isLocationSet() == "true" ) {
            this.retrieveData( 7, storage.getLocation(), function(data){
                $.each(data, function( index, value ){
                    out_strings.push( value['snow_depth'] );
                    out_strings.shift();
                });
                storage.storeSnow( JSON.stringify(out_strings) );
            });
        }
    },

    retrieveData: function(rows, location, callback) {
        var data_e = [
                {"id": 1, "city": "Evanston", "state": "IL", "zip": "60201", "snow_depth": 2.1, "rdate": "2014-11-30 07:04:03"},
                {"id": 2, "city": "Evanston", "state": "IL", "zip": "60201", "snow_depth": 2.0, "rdate": "2014-11-30 08:02:09"},
                {"id": 3, "city": "Evanston", "state": "IL", "zip": "60201", "snow_depth": 2.3, "rdate": "2014-11-30 09:22:53"},
                {"id": 4, "city": "Evanston", "state": "IL", "zip": "60201", "snow_depth": 2.2, "rdate": "2014-11-30 10:10:10"},
                {"id": 5, "city": "Evanston", "state": "IL", "zip": "60201", "snow_depth": 3.2, "rdate": "2014-11-30 11:44:01"},
                {"id": 6, "city": "Evanston", "state": "IL", "zip": "60201", "snow_depth": 2.7, "rdate": "2014-11-30 12:00:11"},
                {"id": 7, "city": "Evanston", "state": "IL", "zip": "60201", "snow_depth": 1.2, "rdate": "2014-11-30 13:09:20"},
                {"id": 8, "city": "Evanston", "state": "IL", "zip": "60201", "snow_depth": 1.1, "rdate": "2014-11-30 14:01:00"},
                {"id": 9, "city": "Evanston", "state": "IL", "zip": "60201", "snow_depth": 2.2, "rdate": "2014-11-30 15:12:13"},
                {"id": 10, "city": "Evanston", "state": "IL", "zip": "60201", "snow_depth": 3.2, "rdate": "2014-11-30 16:04:03"},
                {"id": 11, "city": "Evanston", "state": "IL", "zip": "60201", "snow_depth": 2.7, "rdate": "2014-11-30 17:02:09"}];
        var data_r = [
                {"id": 1, "city": "Chicago", "state": "IL", "zip": "60201", "snow_depth": 1.3, "rdate": "2014-11-30 07:04:03"},
                {"id": 2, "city": "Chicago", "state": "IL", "zip": "60201", "snow_depth": 1.2, "rdate": "2014-11-30 08:02:09"},
                {"id": 3, "city": "Chicago", "state": "IL", "zip": "60201", "snow_depth": 0.9, "rdate": "2014-11-30 09:22:53"},
                {"id": 4, "city": "Chicago", "state": "IL", "zip": "60201", "snow_depth": 0.5, "rdate": "2014-11-30 10:10:10"},
                {"id": 5, "city": "Chicago", "state": "IL", "zip": "60201", "snow_depth": 0.1, "rdate": "2014-11-30 11:44:01"},
                {"id": 6, "city": "Chicago", "state": "IL", "zip": "60201", "snow_depth": 0.0, "rdate": "2014-11-30 12:00:11"},
                {"id": 7, "city": "Chicago", "state": "IL", "zip": "60201", "snow_depth": 0.0, "rdate": "2014-11-30 13:09:20"},
                {"id": 8, "city": "Chicago", "state": "IL", "zip": "60201", "snow_depth": 0.0, "rdate": "2014-11-30 14:01:00"},
                {"id": 9, "city": "Chicago", "state": "IL", "zip": "60201", "snow_depth": 1.2, "rdate": "2014-11-30 15:12:13"},
                {"id": 10, "city": "Chicago", "state": "IL", "zip": "60201", "snow_depth": 2.0, "rdate": "2014-11-30 16:04:03"},
                {"id": 11, "city": "Chicago", "state": "IL", "zip": "60201", "snow_depth": 2.1, "rdate": "2014-11-30 17:02:09"}];
        var data_s = [
                {"id": 1, "city": "Skokie", "state": "IL", "zip": "60201", "snow_depth": 1.2, "rdate": "2014-11-30 07:04:03"},
                {"id": 2, "city": "Skokie", "state": "IL", "zip": "60201", "snow_depth": 1.2, "rdate": "2014-11-30 08:02:09"},
                {"id": 3, "city": "Skokie", "state": "IL", "zip": "60201", "snow_depth": 1.4, "rdate": "2014-11-30 09:22:53"},
                {"id": 4, "city": "Skokie", "state": "IL", "zip": "60201", "snow_depth": 1.5, "rdate": "2014-11-30 10:10:10"},
                {"id": 5, "city": "Skokie", "state": "IL", "zip": "60201", "snow_depth": 1.5, "rdate": "2014-11-30 11:44:01"},
                {"id": 6, "city": "Skokie", "state": "IL", "zip": "60201", "snow_depth": 1.8, "rdate": "2014-11-30 12:00:11"},
                {"id": 7, "city": "Skokie", "state": "IL", "zip": "60201", "snow_depth": 1.5, "rdate": "2014-11-30 13:09:20"},
                {"id": 8, "city": "Skokie", "state": "IL", "zip": "60201", "snow_depth": 1.2, "rdate": "2014-11-30 14:01:00"},
                {"id": 9, "city": "Skokie", "state": "IL", "zip": "60201", "snow_depth": 1.2, "rdate": "2014-11-30 15:12:13"},
                {"id": 10, "city": "Skokie", "state": "IL", "zip": "60201", "snow_depth": 1.0, "rdate": "2014-11-30 16:04:03"},
                {"id": 11, "city": "Skokie", "state": "IL", "zip": "60201", "snow_depth": 1.4, "rdate": "2014-11-30 17:02:09"}];
        var data_l = [
                {"id": 1, "city": "Chicago", "state": "IL", "zip": "60201", "snow_depth": 2.3, "rdate": "2014-11-30 07:04:03"},
                {"id": 2, "city": "Chicago", "state": "IL", "zip": "60201", "snow_depth": 3.4, "rdate": "2014-11-30 08:02:09"},
                {"id": 3, "city": "Chicago", "state": "IL", "zip": "60201", "snow_depth": 4.1, "rdate": "2014-11-30 09:22:53"},
                {"id": 4, "city": "Chicago", "state": "IL", "zip": "60201", "snow_depth": 2.5, "rdate": "2014-11-30 10:10:10"},
                {"id": 5, "city": "Chicago", "state": "IL", "zip": "60201", "snow_depth": 1.1, "rdate": "2014-11-30 11:44:01"},
                {"id": 6, "city": "Chicago", "state": "IL", "zip": "60201", "snow_depth": 0.0, "rdate": "2014-11-30 12:00:11"},
                {"id": 7, "city": "Chicago", "state": "IL", "zip": "60201", "snow_depth": 0.0, "rdate": "2014-11-30 13:09:20"},
                {"id": 8, "city": "Chicago", "state": "IL", "zip": "60201", "snow_depth": 0.0, "rdate": "2014-11-30 14:01:00"},
                {"id": 9, "city": "Chicago", "state": "IL", "zip": "60201", "snow_depth": 1.2, "rdate": "2014-11-30 15:12:13"},
                {"id": 10, "city": "Chicago", "state": "IL", "zip": "60201", "snow_depth": 2.0, "rdate": "2014-11-30 16:04:03"},
                {"id": 11, "city": "Chicago", "state": "IL", "zip": "60201", "snow_depth": 2.1, "rdate": "2014-11-30 17:02:09"}];

        var data = [], dat;
        switch ("data_" + location.charAt(0).toLowerCase()){
            case "data_e":
                dat = data_e;
                break;
            case "data_r":
                dat = data_r;
                break;
            case "data_s":
                dat = data_s;
                break;
            case "data_l":
                dat = data_l;
                break;
        };

        for (var i = 0; i < rows; i++)
            data.push( dat[i] );

        if (data && callback)
            callback(data);
    },

    formatDate: function() {
        /*var d = new Date(2015, 0, 1, 7, 0, 0, 0);

        var month;

        switch(d.getMonth) {

            case 0:

                month = “Jan.”;

                break;

            case 1:

                month = “Feb.”;

                break;

            case 2:

                month = “Mar.”;

                break;

            case 3:

                month = “Apr.”;

                break;

            case 4:

                month = “May”;

                break;

            case 5:

                month = “Jun.”;

                break;

            case 6:

                month = “Jul.”;

                break;

            case 7:

                month = “Aug.”;

                break;

            case 8:

                month = “Sep.”;

                break;

            case 9:

                month = “Oct.”;

                break;

            case 10:
                month = “Nov.”;
                break;
            case 11:
                month = “Dec.”;
                break;
            default:
                month = “Not a month”;
                break;
        }*/

    }

}
