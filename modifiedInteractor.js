/*
BSD 2-Clause License

Copyright (c) 2016, Benjamin Cordier
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

//--Any comments starting with 2 hypens are my own documentation

var Interactor = function (config) {    
    // Call Initialization on Interactor Call
    //--config is just an object the user passes to the constructor in a script on the webpage - contains all the customisable parts of interactor
    this.__init__(config);
};

Interactor.prototype = {

    // Initialization
    __init__: function (config) {

        var interactor = this;
        
        // Argument Assignment          // Type Checks                                                                          // Default Values
        interactor.interactions       = typeof(config.interactions)               == "boolean"    ? config.interactions        : true,
        interactor.interactionElement = typeof(config.interactionElement)         == "string"     ? config.interactionElement :'interaction',
        interactor.interactionEvents  = Array.isArray(config.interactionEvents)   === true        ? config.interactionEvents  : ['mouseup', 'touchend'],
        interactor.conversions        = typeof(config.conversions)                == "boolean"    ? config.conversions        : true,
        interactor.conversionElement  = typeof(config.conversionElement)          == "string"     ? config.conversionElement  : 'conversion',
        interactor.conversionEvents   = Array.isArray(config.conversionEvents)    === true        ? config.conversionEvents   : ['mouseup', 'touchend'],
        interactor.endpoint           = typeof(config.endpoint)                   == "string"     ? config.endpoint           : '/interactions',
        interactor.async              = typeof(config.async)                      == "boolean"    ? config.async              : true,
        interactor.debug              = typeof(config.debug)                      == "boolean"    ? config.debug              : true,
        interactor.records            = [],
        interactor.session            = {},
        interactor.loadTime           = new Date();
        
        // Initialize Session
        interactor.__initializeSession__();
        // Call Event Binding Method
        interactor.__bindEvents__();
        
        return interactor;
    },

    // Create Events to Track
    __bindEvents__: function () {
        
        var interactor  = this;

        // Set Interaction Capture
        if (interactor.interactions === true) {
            for (var i = 0; i < interactor.interactionEvents.length; i++) {
                document.querySelector('body').addEventListener(interactor.interactionEvents[i], function (e) {
                    e.stopPropagation();
                    if (e.target.classList.value === interactor.interactionElement) {
                        interactor.__addInteraction__(e, "interaction");
                    }
                });
            }   
        }

        // Set Conversion Capture
        if (interactor.conversions === true) {
            for (var i = 0; i < interactor.conversionEvents.length; i++) {
                document.querySelector('body').addEventListener(interactor.conversionEvents[i], function (e) {
                    e.stopPropagation();
                    if (e.target.classList.value === interactor.conversionElement) {
                        interactor.__addInteraction__(e, "conversion");
                    }
                });
            }   
        }

        // Bind onbeforeunload Event
        window.onbeforeunload = function (e) {
            interactor.__sendInteractions__();
        };
        
        return interactor;
    },

    // Add Interaction Object Triggered By Events to Records Array
    __addInteraction__: function (e, type) {
        var interactor = this;
        var interaction = new Object();//--stores all the info for a particular interaction

        interaction.myEventType = e.type;//--so the replicator knows how to handle the event
        interaction.target = e.target.id;//--the element the event was triggered on
        interaction.createdAt = new Date();//--defaults to current time so that timing can be worked out relative to load time
        switch (e.type) {//--this can be expanded in future to accomodate new events
            case "keypress":
                interaction.key = e.key;//--key pressed as a string
                interaction.shiftkey = e.shiftKey;
                interaction.altkey = e.altKey;
                interaction.ctrlkey = e.ctrlKey;
                break;

            case "mousedown":
                interaction.buttons = e.buttons;//--sum of numerical values indicating the mouse button pressed
                break;

            default:
                break;
        }
        
        // Insert into Records Array
        interactor.records.push(interaction);

        // Log Interaction if Debugging
        if (interactor.debug) {
            // Close Session & Log to Console
            interactor.__closeSession__();
            console.log("Session:\n", interactor.session);
        }

        return interactor;
    },

    // Generate Session Object & Assign to Session Property
    __initializeSession__: function () {
        var interactor = this;

        // Assign Session Property
        interactor.session  = {
            loadTime        : interactor.loadTime,//--when the session loads - used relative to interaction times to calculate timings
            unloadTime      : new Date(),//--determines when the driver closes the webpage
            href            : window.location.href,//--determines the page to replicate
        };

        return interactor;
    },

    // Insert End of Session Values into Session Property
    __closeSession__: function () {

        var interactor = this;

        // Assign Session Properties
        interactor.session.unloadTime   = new Date();
        interactor.session.interactions = interactor.records;

        return interactor;
    },


    // Gather Additional Data and Send Interaction(s) to Server
    __sendInteractions__: function () {
        var interactor  = this,
            // Initialize Cross Header Request
            xhr         = new XMLHttpRequest();
            
        // Close Session
        interactor.__closeSession__();

        // Post Session Data Serialized as JSON
        xhr.open('POST', interactor.endpoint, interactor.async);//--opens a POST request to the receiver server (specified by the user but usually just a loopback)
        xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');//--sets headings to make receiving data easier
        xhr.send(JSON.stringify(interactor.session));//--sends a json of all the data interactor is currently holding

        return interactor;
    }

};
