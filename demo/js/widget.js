/**
 * widget.js
 * This library contains all the visualization widget such as pie chart, barchart, counter, alert etc.
 *
 * @license GPL-3.0, https://opensource.org/licenses/GPL-3.0
 * @author  rockaway
 */
var DEFAULT_WIDTH = 250, 
    DEFAULT_HEIGHT = 250,
    WIDGET_PIECHART = 'piechart', 
    WIDGET_VERTICAL_BARCHART = 'vertical_barchart', 
    WIDGET_HORIZONTAL_BARCHART = 'horizontal_barchart', 
    WIDGET_COUNTER = 'counter', 
    WIDGET_ALERT = 'alert';
var Widget = function(init,width,height) {
    this.id = init.hasOwnProperty('id')?init.id:'widget_'+Date.now();
    this.active = init.hasOwnProperty('active')?init.active:(init.hasOwnProperty('id')?true:false);
    this.type = init.type;
    this.data = init.data;
    this.width = init.hasOwnProperty('width')?init.width:(width || DEFAULT_WIDTH);
    this.height = init.hasOwnProperty('height')?init.height:(height || DEFAULT_HEIGHT);
    this.isActive = function () {
        return this.active;
    };    
    this.refresh = function () {
        if (this.isActive())
            this.update();
        else
            this.create();
    };    
    this.create = function (){
        console.log('create ' + this.type + ' ' + this.id);
        if (this.type==WIDGET_ALERT){
            $('body').prepend('<div id="'+this.id+'" class="alert"></div>');   
            $('#'+this.id).append('<span class="close-button">x</span>');
            $('#'+this.id+' .close-button').click(function(){$(this).parent().remove();});
        }
        else {
            $('.widget-container').prepend('<div id="'+this.id+'" class="widget"></div>');
            $('#'+this.id).append('<span class="header">'+this.id+'<span class="button minimize">-</span><span class="button maximize">+</span><span class="button close">x</span></span>');
            $('#'+this.id+' .button.close').click(function(){$(this).parent().parent().remove();});
            $('#'+this.id+' .button.minimize').click(function(){
                alert('minimize');
            });
            $('#'+this.id+' .button.maximize').click(function(){ 
                alert('maximize');
            });
            $('#'+this.id).css({color:randomColor(),width:this.width,height:this.height});
            $('#'+this.id).click(function(){
                $('.widget').removeClass('active');
                $(this).addClass('active');
                var retrieveData = function (id,type){
                    switch (type) {
                        case WIDGET_VERTICAL_BARCHART:
                            return JSON.stringify(d3.select('#'+id).selectAll('.nv-wrap.nv-discretebar').data()[0]);
                        case WIDGET_HORIZONTAL_BARCHART:
                            return JSON.stringify(d3.select('#'+id).selectAll('div').data());
                        case WIDGET_PIECHART:
                            return  JSON.stringify( d3.select('#'+id).selectAll('.nv-wrap.nv-pie').data()[0] );//it seems returning array of array
                        case WIDGET_COUNTER:
                            return '{"counter":'+$('#'+id).data('counter')+',"title":"'+$('#'+id).data('title')+'","subscript":"'+$('#'+id).data('subscript')+'"}';
                        default:
                            throw "Unsupported type " + type;
                    }      
                };
                //set input form values (keep here for demo script only)
                $('#push_data').val(retrieveData($(this).data('id'),$(this).data('type')));
                $('#radio_'+$(this).data('type')).prop('checked', true);
            });
            $('#'+this.id).attr(JSON.parse( '{"data-id":"'+this.id+'"}' ));
            $('#'+this.id).attr(JSON.parse( '{"data-type":"'+this.type+'"}' ));
        }
        this.render('create');
    };
    this.update = function () {
         console.log('update ' + this.type + ' ' + this.id);
         this.render('update');
    };
    this.render = function (mode){
        console.log(this);
        switch (this.type) {
           case WIDGET_ALERT:
               new Alert('#'+this.id,this.data.message).render();
               break;
           case WIDGET_HORIZONTAL_BARCHART:
               new HorizontalBarChart('#'+this.id,this.data,this.width).render();
               break;
           case WIDGET_VERTICAL_BARCHART:
               new VerticalBarChart('#'+this.id,this.data,this.width,this.height).render(mode);
               break;
           case WIDGET_PIECHART:
               new PieChart('#'+this.id,this.data,this.width,this.height).render(mode);
               break;
           case WIDGET_COUNTER:
               new Counter('#'+this.id,this.data,this.width,this.height).render(mode);
               break;
           default:
               throw "Unsupported type " + this.type;
       }      
    };    
};
var Alert = function (selector, message) {
    this.selector  = selector;
    this.message  = message;
    this.render = function () {
        $(this.selector).append('<div>'+this.message+'</div>');
        $(this.selector).css({background:randomD3Color(),color:randomColor()});
    };
};
var HorizontalBarChart = function (selector, data, width) {
    this.selector  = selector;
    this.data  = data;
    this.width  = width || DEFAULT_WIDTH;
    this.render = function () {
        var div = d3.select(this.selector).selectAll("div")
            .data(this.data, function(d){ return d; });
        var w = d3.scale.linear().domain([0, d3.max(this.data)]).range([0, this.width]);
        div.enter()
            .append("div")
            .style("width", function(d) { return w(d) + "px"; })
            .style("background", randomD3Color())
            .text(function(d) { return d; });
        div.exit().remove();   
    };
};
var VerticalBarChart = function (selector, data, width, height) {
    this.selector  = selector;
    this.label = {"x_axis":"X Axis Label","y_axis":"Y Axis Label"};
    this.data  = data;
    this.width  = width || DEFAULT_WIDTH;
    this.height  = height || DEFAULT_HEIGHT;
    this.render = function (mode) {
        switch (mode) {
           case "create":
               $(this.selector).append('<svg class="verticalBarChart"></svg>');
               $('#'+this.id).css({width:this.width,height:this.height});
               break;
           case "update":
               //do nothing
               break;
           default:
               throw "Unsupported mode " + mode;
        }    
        this.draw(this.selector,this.data,this.width,this.height, this.label);
    };
    this.draw = function (selector, data, width, height, label) {
        nv.addGraph(function() {  
              var chart = nv.models.discreteBarChart()
                  .x(function(d) { return d.label })
                  .y(function(d) { return d.value })
                  .color(randomD3ColorRange(20))
                  .staggerLabels(false)
                  //.staggerLabels(data[0].values.length > 8)
                  .tooltips(false)
                  .showValues(true)
                    .width(width - 8)
                    .height(height - 8 )
                    .transitionDuration(250);

              d3.select(selector+' svg')
                  .datum(data)
                  .call(chart);
              //set x axis label
              d3.select(selector+' svg').append("text")
                .attr("class", "x label")
                .attr("text-anchor", "end")
                .attr("x", width - 25)
                .attr("y",  height - 30 )    
                .text(label.x_axis);
              
              //set y axis label
              d3.select(selector+' svg').append("text")
                .attr("class", "y label")
                .attr("text-anchor", "end")
                .attr("y", 6)
                .attr("dy", ".75em")
                .attr("transform", "rotate(-90)")
                .text(label.y_axis);

              nv.utils.windowResize(chart.update);

              return chart;
        });
    };
};
var PieChart = function (selector, data, width, height) {
    this.selector  = selector;
    this.data  = data;
    this.width  = width || DEFAULT_WIDTH;
    this.height  = height || DEFAULT_HEIGHT;
    this.render = function (mode) {
        switch (mode) {
           case "create":
               $(this.selector).append('<svg class="piechart"></svg>');
               $('#'+this.id).css({width:this.width,height:this.height});
               break;
           case "update":
               //do nothing
               break;
           default:
               throw "Unsupported mode " + mode;
        }    
        this.draw(this.selector,this.data,this.width,this.height);
    };
    this.draw = function (selector, data, width, height) {
        console.log('piechart selector '+selector);
        console.log('piechart width and height: '+width + ', ' + height);
        nv.addGraph(function() {            
            var chart = nv.models.pieChart()
                 .x(function(d) { return d.key })
                 .y(function(d) { return d.value })
                 //.color(d3.scale.category10().range())
                 .color(randomD3ColorRange(20))
                 .width(width)
                 .height(height);
         
            d3.select(selector+' svg').datum(data)
                   .transition().duration(1200)
                   .attr('width', width)
                   .attr('height', height)
                   .call(chart);
            chart.dispatch.on('stateChange', function(e) { nv.log('New State:', JSON.stringify(e)); });
            
            
            return chart;
        });     
    };
};
var Counter = function (selector, data, width, height) {
    this.selector  = selector;
    this.data  = data;
    this.width  = width || DEFAULT_WIDTH;
    this.height  = height || DEFAULT_HEIGHT;    
    this.render = function (mode) {
        switch (mode) {
           case "create":
               $(this.selector).addClass('counter');
               for (var prop in this.data)
                   $(this.selector).append('<div class="'+prop+'">'+this.data[prop]+'</div>');
               break;
           case "update":
               for (var prop in this.data)
                   $(this.selector+' .'+prop).html(this.data[prop]);
               break;
           default:
               throw "Unsupported mode " + mode;
       }    
       this.draw();
    };
    this.draw = function () {
        for (var prop in this.data){
            if (prop!='last_update_date')
                $(this.selector).attr(JSON.parse( '{"data-'+prop+'":"'+this.data[prop]+'"}' ));
        }    
        $(this.selector+' .title').css({color:randomColor()});
        $(this.selector+' .subscript').css({color:randomColor()});
        $(this.selector).css({color:randomColor(),width:this.width,height:this.height}); 
    };
};

var randomNumber = function (ceiling){ return Math.floor(Math.random() * ceiling); };
var randomD3Color = function () { return d3.scale.category20().range()[randomNumber(20)];};
var randomD3ColorRange = function (n) {
    var d3color = d3.scale.category20().range();
    var arr = [];
    for (var i = 0; i < n; i++ ) 
        arr.push(d3color[randomNumber(20)]);
    return arr;
};
var randomColor = function () {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[randomNumber(16)];
    }
    return color;
};