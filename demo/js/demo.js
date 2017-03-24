/**
 * widget.js
 * This library contains all the visualization widget such as pie chart, barchart, counter, alert etc.
 *
 * @license GPL-3.0, https://opensource.org/licenses/GPL-3.0
 * @version 0.1
 * @author  rockaway
 *
 */
function getPushDataSample(type){
    var input = {};
    var randomRange = function (itemCount,ceiling) {
        var range = [];
        for ( var i =0; i<itemCount; i++){
            range.push(randomNumber(ceiling));
        }
        return range;
    };    
    switch (type) {
        case WIDGET_VERTICAL_BARCHART:
          input.hint = 'Format: [any json encoded array] , Example: [{key:\'Barchart\',value:[{label:\'A\',value:10},{label:\'B\',value:20}]}]';
          input.data = JSON.stringify([ 
                                {"key":"Barchart",
                                 "values":[
                                         {"label":"A","value":randomNumber(10)}, 
                                         {"label":"B","value":randomNumber(20)}, 
                                         {"label":"C","value":randomNumber(30)}, 
                                         {"label":"D","value":randomNumber(40)}, 
                                         {"label":"E","value":randomNumber(50)}, 
                                        ]
                                }
                             ]);
          break;
        case WIDGET_HORIZONTAL_BARCHART:
          input.hint = 'Format: [any number array] , Example: [1,2,3,4,5,6,7,8,9,10,11,12]';
          input.data = JSON.stringify(randomRange(12,50) );
          break;
        case WIDGET_PIECHART:
          input.hint = 'Format: [any json object with key value pair] , Example: [{key: \'One\',value: 5},{key: \'Two\',value: 2}]';
          input.data = JSON.stringify([
                            {key: "Group 1",value: randomNumber(50)},
                            {key: "Group 2",value: randomNumber(40)},
                            {key: "Group 3",value: randomNumber(30)},
                            {key: "Group 4",value: randomNumber(20)},
                          ]);
          break;
        case WIDGET_ALERT:
          input.hint = 'Format: json encoded message , Example: {"message":"This is a test alert message"}';
          input.data = '{"message":"This is a test alert message"}';
          break;
        case WIDGET_COUNTER:
          var cnt = Math.floor(Math.random() * 1000);
          input.hint = 'Format: json encoded message , Example: {"counter":8,"title":"Counter Title","subscript":"Counter Subscript 1"}';
          input.data = '{"counter":'+cnt+',"title":"Counter Title","subscript":"'+(cnt%2==1?'Counter Subscript 1':'Counter Subscript 2')+'"}';
          break;
        default:
          throw "Unsupported type " + type;
    }
    return input;
}   

