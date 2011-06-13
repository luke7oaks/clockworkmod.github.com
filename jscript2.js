// Developer >> Rom List >> Rom Details
//TODO:  escape!
$(document).ready(function()
 {
    $("#devTab").addClass("selected");

    var devices = null;
    var developers = null;

    // Attempt to fill page with content
    function doStuff()
    {
        if (devices == null || developers == null)
        {
            return;
        }

        //Fill developer list
        $.each(developers,
        function(i, val)
        {
            $("ul.devlist").append('<li><a class="DEV" id = "dev' + i + '" href="#">' + val.developer + '</a></li>');
        });

        // Fill drop down list
        $.each(devices,
        function(i, val)
        {
            $("select.filter").append('<option value = "' + val.key + '">' + val.key + '</option>');
        });

        // Clicking button will narrow down developer list to device in drop down
        $("input.fButton").click(function(event)
        {
            $('a').removeClass("hideDev");
            var listVal = String(document.getElementById('filter').value);

            if (listVal != "-")
            {
                $.each(developers,
                function(i, val)
                {

                    // Check to see if developer supports device
                    $.each(val.roms,
                    function(j, rList)
                    {
                        // Add class to hide developers that don't support the device
                        if (j != listVal)
                        {
                            $("#dev" + i).addClass("hideDev");
                        }
                    });
                });
            }
        });

        // Clicking developer name should create new tab for his roms,
        // hide the developer tab, and show the new tab
        $("a.DEV").click(function(event)
        {
            event.preventDefault();
            $("#devInfo").remove();
            $("#romListTab").remove();
            $("div.developers").addClass("hide");
            $(".tabItem").removeClass("selected");

            var devIndex = parseInt(this.id[this.id.length - 1]);

            $('#tabs').append('<li><a id = "romListTab" class = "tabItem selected" href="#romList">' + developers[devIndex].developer + '</a></li>');
            $('.newTab').append('<div class = "tabContent romList" id = "devInfo"></div>');

            // Controls for clicking the rom list tab
            $("#romListTab").click(function(event)
            {
                $("div.tabContent").addClass("hide");
                $("a.tabItem").removeClass("selected");
                $("div.romList").removeClass("hide");
                $("#romListTab").addClass("selected");
            });

            //Get icon and summary
            $("#devInfo").append('<img height = 100 width = 100 src = "' + developers[devIndex].icon + '">');
            $("#devInfo").append('<p>' + developers[devIndex].summary + '</p><ol id= "romOL"></ol>');

            // List the roms
            // Clicking a rom will create a new tab with ratings and a download option
            $.get("http://jsonp.deployfu.com/clean/" + encodeURIComponent(developers[devIndex].manifest),
            function(data) {
                $.each(data.roms,
                function(i, val) 
                {
                    $("#romOL").append('<li class = "devRom"><a class = "ROM"  id = "' + developers[devIndex].id + devIndex + i +'" href="#">' + val.name + '</a></li>');
                });

            },
            "jsonp"
            );

        });

        $("#devTab").click(function(event)
        {
            $("div.tabContent").addClass("hide");
            $("a.tabItem").removeClass("selected");
            $("div.developers").removeClass("hide");
            $("#devTab").addClass("selected");
        });



    }

    $("a.ROM").click(function(event) {
        event.preventDefault();
        $("#romInfo").remove();
        $("#romInfoTab").remove();
        $("div.romList").addClass("hide");
        $(".tabItem").removeClass("selected");

        var devIndex = parseInt(this.id[this.id.length - 2]);
        var romIndex = parseInt(this.id[this.id.length - 1]);
        var romName = null;

        $.get("http://jsonp.deployfu.com/clean/" + encodeURIComponent(developers[devIndex].manifest),
        function(data){
            romName = data.roms[romIndex].name;
        },
        "jsonp");

        $('#tabs').append('<li><a id = "romInfoTab" class = "tabItem selected" href="#romInfo">' + romName + '</a></li>');
        $('.newTab').append('<div class = "tabContent romInfo" id = "devInfo"></div>');

        // Controls for clicking the rom list tab
        $("#romInfoTab").click(function(event)
        {
            $("div.tabContent").addClass("hide");
            $("a.tabItem").removeClass("selected");
            $("div.romInfo").removeClass("hide");
            $("#romInfoTab").addClass("selected");
        });
        
    });


    //Will be used to alphabetize the drop down menu by first character
    function sortDevices(itemList)
    {
        for (i = 1; i < itemList.length; i++)
        {
            var temp = itemList[i];
            var j = i - 1;

            while (j >= 0 && itemList[j].key[0].toLowerCase() > temp.key[0].toLowerCase())
            {
                itemList[j + 1] = itemList[j];
                j = j - 1;
            }
            while (j >= 0 &&
            itemList[j].key[0].toLowerCase() == temp.key[0].toLowerCase() &&
            itemList[j].key[1].toLowerCase() > temp.key[1].toLowerCase())
            {
                itemList[j + 1] = itemList[j];
                j = j - 1;
            }

            itemList[j + 1] = temp;
        }
    }

    //Will be used to alphabetize the drop down menu by first character
    function sortDevs(itemList) {
        for (i = 1; i < itemList.length; i++)
        {
            var temp = itemList[i];
            var j = i - 1;

            while (j >= 0 && itemList[j].developer[0].toLowerCase() > temp.developer[0].toLowerCase())
            {
                itemList[j + 1] = itemList[j];
                j = j - 1;
            }
            while (j >= 0 &&
            itemList[j].developer[0].toLowerCase() == temp.developer[0].toLowerCase() &&
            itemList[j].developer[1].toLowerCase() > temp.developer[1].toLowerCase())
            {
                itemList[j + 1] = itemList[j];
                j = j - 1;
            }

            itemList[j + 1] = temp;
        }
    }

    //Grab device info
    var uri = "http://gh-pages.clockworkmod.com/ROMManagerManifest/devices.js";
    $.get("http://jsonp.deployfu.com/clean/" + encodeURIComponent(uri),
    function(data)
    {
        devices = data.devices;
        sortDevices(devices);
        doStuff();
    },
    "jsonp"
    );

    //Get developers
    $.get(
    "http://jsonp.deployfu.com/clean/http%3A%2F%2Fromshare.deployfu.com%2Fmanifest",
    function(data)
    {
        developers = data.manifests;
        sortDevs(developers);
        doStuff();
    },
    "jsonp"
    );
});