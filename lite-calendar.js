/**
 * Created by samuel on 2016/7/8.
 */


(function (window) {


    function addClass(dom,clz){
        if(!dom) return;
        var oldClz = dom.className;
        if(!oldClz) oldClz = '';
        if(/clz/.test(oldClz)){
            return;
        }else{
            oldClz = oldClz.trim() + ' ' + clz;
        }
        dom.className = oldClz;
    }

    function removeClass(dom,clz) {
        var oldClz = dom.className;
        if(!oldClz) oldClz = '';
        if(new RegExp(clz).test(oldClz)){
            oldClz = oldClz.replace(clz,'');
            dom.className = oldClz;

        }
    }

    /**
     * add event
     * @param dom
     * @param type
     * @param cb
     */
    function bindEvent(dom,type,cb){
        if(window.addEventListener && typeof window.addEventListener === 'function'){

            dom.addEventListener(type, function () {
                if(cb && typeof cb === 'function'){
                    cb();
                }
            });

        }else if(window.attachEvent && typeof window.attachEvent === 'function'){
            dom.attachEvent(type, function () {
                if(cb && typeof cb === 'function'){
                    cb();
                }
            });
        }else{
            dom['on'+type] = function () {
                if(cb && typeof cb === 'function'){
                    cb();
                }
            };
        }
    }


    var CLASS_ACTIVE = 'active';

    var CLASS_INACTIVE = 'inactive';

    var CLASS_DISABLE = 'disabled';

    var CLASS_TODAY = '.today';

    var curDate = new Date();


    var WEEK_TEXTS = ['一','二','三','四','五','六','日'];

    var defaultOptions = {

        firstDayOfWeek : 7,

        year : curDate.getFullYear(),

        month : curDate.getMonth(),  // 0 -11

        date : curDate.getDate()

    };

    /**
     * DateItem Constructor
      * @param text
     * @param value
     * @param clz
     * @param state
     * @constructor
     */
    function DateItem(text, value,clz,state) {
        if(!clz) clz = '';
        if(!state) state = '';
        this.text = text;
        this.value = value;
        this.clz = clz;
        this.state = state;
    }

    DateItem.prototype.setState = function (state) {
        this.state = state;
        if(state === CLASS_ACTIVE){
            this.clz = CLASS_ACTIVE;
        }
        if(state === CLASS_INACTIVE){
            this.clz = CLASS_INACTIVE;
        }
    };

    /**
     *
     * @param last [DateItem,DateItem]
     * @param current [DateItem,DateItem]
     * @param next [DateItem,DateItem]
     * @constructor
     */
    function DayInfo(last, current, next,weeks,year,month) {
        this.last = last;
        this.next = next;
        this.current = current;
        this.weeks = weeks;
        this.year = year;
        this.month = month;
    }



    /**
     * judge whether is a leap year
     * @param year
     * @returns {boolean}
     */
    function isLeapYear(year) {
        return (year%4==0 && year%100!=0)||(year%100==0 && year%400==0);
    }

    /**
     * get how many days is in a month
     * @param year
     * @param month start with 0 ,as 0 - 11
     * @returns {number}
     */
    function getDaysOfMonth(year, month) {
        var days = [31,29,31,30,31,30,31,31,30,31,30,31];

        if(isLeapYear(year)){
            days[1] = 28;
        }

        return days[month];
    }



    function getMonthValue(month) {
        if(month >=9){
            return month + 1;
        }
        return '0' + (month + 1);
    }


    function getLastMonth(month) {
        if(month == 0){
            return 11;
        }
        return month - 1;
    }
    function getDateValue(date) {
        if(date > 9){
            return date + '';
        }
        return '0' + date;
    }
    
    function getLastMonthValue(year, month) {
        if(month == 0){
            return (year-1) +'-' + getMonthValue(11);
        }
        return year + '-' + getMonthValue(month - 1);
    }
    function getNextMonthValue(year, month) {
        if(month == 11){
            return (year+1) +'-' + getMonthValue(0);
        }
        return year + '-' + getMonthValue(month + 1);
    }

    /**
     *
     * @param year
     * @param month
     * @returns {string}
     */
    function getCurrentMonthValue(year, month) {
        return year + '-' + getMonthValue(month );
    }
    /**
     * get how many days is in last month, if Jan, get last year's December
     * @param year
     * @param month start with 0 ,as 0-11
     * @returns {number}
     */
    function getDaysOfLastMonth(year,month) {

        if(month == 0){
            return getDaysOfMonth(year-1,11);
        }
        return getDaysOfMonth(year,month-1);
    }
    
    
    function getDisplayDayCountOfLastMonth(firstDayOfThisWeek) {

        switch (defaultOptions.firstDayOfWeek){
            case 1 :{
                return 7 - (7 - firstDayOfThisWeek + 1);
            }break;
            case 2 :{
            }break;
            case 3 :{}break;
            case 4 :{}break;
            case 5 :{}break;
            case 6 :{}break;
            case 7 :{
                if(7 == firstDayOfThisWeek){
                    return 0;
                }
                return 7- (6 - firstDayOfThisWeek + 1);
            }break;
        }
    }

    /**
     *
     * @param year
     * @param month
     * @param displayDayCountOfLastMonth
     * @returns {Array}  [ {text:'',value:'1991-08-07'} ]
     */
    function getDisplayDatesOfLastMonth(year,month,displayDayCountOfLastMonth) {


        var lastDate = getDaysOfLastMonth(year,month);

        var lastMonth = getLastMonthValue(year,month); // 1991-08

        var days = [];

        // 5 ,31
        for(var i = 0;i < displayDayCountOfLastMonth ; i ++){
            var text = lastDate - displayDayCountOfLastMonth + 1 + i;
            days[i] = new DateItem(text,lastMonth +'-'+ getDateValue(text),'disable','disable');
        }

        return days;
    }

    /**
     *
     * @param year
     * @param month
     * @param displayDayCountOfNextMonth
     * @returns {Array} [ {text:'',value:'1991-08-07'} ]
     */
    function getDisplayDatesOfNextMonth(year,month,displayDayCountOfNextMonth) {

        var days = [];

        var nextMonth = getNextMonthValue(year,month); // 1991-08

        // 5 ,31
        for(var i = 0;i < displayDayCountOfNextMonth ; i ++){
            var text = i + 1;
            days[i] = new DateItem(text,nextMonth +'-'+ getDateValue(text),'disable','disable');
        }

        return days;
    }
    
    function getWeeksArray() {
        var firstDayOfWeek  = defaultOptions.firstDayOfWeek;

        var weeks = [];
        var last = 0;
        for(var i = 0 ; i < 7 ; i ++){
            if(i == 0){
                weeks[i] = WEEK_TEXTS[firstDayOfWeek-1];
                last = firstDayOfWeek;
            }else{
                if(last == 7){
                    last = 1;
                    weeks[i] = WEEK_TEXTS[last-1];
                }else{
                    last ++;
                    weeks[i] = WEEK_TEXTS[last-1];
                }
            }

        }
        return weeks;
    }

    /**
     *  get Today information of a specified date
     * @param d instance of Date
     */
    function getToday(d) {

        if(!d) d = new Date();

        var month = d.getMonth();

        var date = d.getDate();

        var year = d.getFullYear();

        var daysOfMonth = getDaysOfMonth(year,month);

        d.setDate(1);

        var firstDayOfWeek = d.getDay();

        d.setDate(daysOfMonth);

        var displayDayCountOfLastMonth = getDisplayDayCountOfLastMonth(firstDayOfWeek);


        var displayDayArrayOfLastMonth = getDisplayDatesOfLastMonth(year,month,displayDayCountOfLastMonth);


        var displayDayCountOfNextMonth = 42 - daysOfMonth - displayDayCountOfLastMonth;

        var displayDayArrayOfNextMonth = getDisplayDatesOfNextMonth(year,month,displayDayCountOfNextMonth);

        var displayDayArrayOfThisMonth = [];

        var currentMonthValue = getCurrentMonthValue(year,month);

        for(var i = 0;i < daysOfMonth; i ++){
            var text = i + 1;
            var clz = '';
            if(i + 1 == date){
                clz = 'today';
            }
            displayDayArrayOfThisMonth[i] = new DateItem(text,currentMonthValue + '-' + getDateValue(text),clz);
        }

        return new DayInfo(displayDayArrayOfLastMonth,displayDayArrayOfThisMonth,displayDayArrayOfNextMonth,getWeeksArray(),year,month);

    }

    /**
     *  Render Calendar UI Style, override this method for customization
	 *  渲染 日历组件 ，重写这个方法来实现自定义的UI
     * @param dayInfo
	 * 	
	 *
     */
    function renderCalendar(dayInfo){

       var renderHeader = function (year,month) {
           return '<div class="title"><span class="prev"></span><span class="year-month text">'+year+'年'+getMonthValue(month)+'月</span><span class="next"></span></div>';
       };

       var renderGridBox = function (weeks,last,current,next) {

           var renderWeeks = function (weeks) {
               var _week_items = [];
               for(var i = 0;i < weeks.length;i++){
                   var week = weeks[i];
                   _week_items = _week_items + '<div class="day">'+week+'</div>';
               }
               return '<div class="weeks"><div class="day-row week-row">'+_week_items+'</div></div>';
           };
           
           function renderDays(days) {
               var days_html = '';
               var dayStart = false;
               for(var i = 0;i < days.length;i+=7){
                   days_html = days_html + '<div class="day-row">';
                   for(var j = 0;j < 7;j ++){
                       var day = days[i+j];
                       days_html = days_html + '<div class="day '+day.clz+'" data-sate="'+day.state+'" data-value="'+day.value+'">'+day.text+'</div>';
                   }
                   days_html = days_html + '</div>';
               }
               return days_html;
           }

           var gridHtml =
               '<div class="grid-box">' +
                   renderWeeks(weeks)+
                   renderDays([].concat(last).concat(current).concat(next))+
               '</div>';
            return gridHtml;
       };
       return renderHeader(dayInfo.year,dayInfo.month) + renderGridBox(dayInfo.weeks,dayInfo.last,dayInfo.current,dayInfo.next);
    }

    function bindCalendarEvent(calendar){
        var dom = calendar.dom;
        var pre = dom.querySelector('.title .prev');
        var next = dom.querySelector('.title .next');

        bindEvent(pre, 'click',function () {
            calendar.turnToPrevMonth(dom);
        });
        bindEvent(next, 'click',function () {
            calendar.turnToNextMonth(dom);
        });


    }


    /**
     *
     * liteCalendar Class
     *
     * @param dom
     * @param d
     */
    function liteCalendar(dom,d) {
        this.dom = dom;
        this.init(dom,d);
    }

	/**************************************************************\
	 *
	 *  Following methods are Calendar API
	 *  
	 *  It's recommended to extend Calendar Functions below this comment area
	 *
	 ***********************************************************/

    liteCalendar.prototype.getToday = getToday;
    liteCalendar.prototype.renderCalendar = renderCalendar;
    liteCalendar.prototype.init = function (dom,d) {
        if(!d) d = new Date();
        this.updateDate(d);
        var year = d.getFullYear();
        var month = d.getMonth();
        dom.setAttribute('data-year',year);
        dom.setAttribute('data-month',month);
        dom.innerHTML = renderCalendar(getToday(d));
        bindCalendarEvent(this);
        this.hightToday(dom);
        if(this.onAfterRefresh && typeof this.onAfterRefresh === 'function'){
            this.onAfterRefresh(dom,this.today,this.year,this.month,this.date);
        }
        console.log(this);
    };


    liteCalendar.prototype.setActive = function (dom,activeList){

        for(var i = 0; i < activeList.length; i ++){
            var date = activeList[i];
            removeClass(dom.querySelectorAll('.day[data-value="'+date+'"]')[0],'inactive');
            addClass(dom.querySelectorAll('.day[data-value="'+date+'"]')[0],'active');
        }
    };

    /**
     * set inactive
     * @param dom
     * @param activeList
     */
    liteCalendar.prototype.setInactive = function (dom,activeList){

        for(var i = 0; i < activeList.length; i ++){
            var date = activeList[i];
            removeClass(dom.querySelectorAll('.day[data-value="'+date+'"]')[0],'active');
            addClass(dom.querySelectorAll('.day[data-value="'+date+'"]')[0],'inactive');
        }
    };

    /**
     * remove hilight today effect
     * @param dom
     */
    liteCalendar.prototype.removeToday = function (dom){
        removeClass(dom.querySelector('.today'),'today');
    };


    /**
     * hilight today effect
     * @param dom
     */
    liteCalendar.prototype.hightToday = function (dom){
        var d = new Date();
        var value = getCurrentMonthValue(d.getFullYear(), d.getMonth());
        if(d.getDate() < 10){
            value = value + '-0'+ d.getDate();
        }
        value = value + '-'+ d.getDate();
        var todayDom = dom.querySelector('.day[data-value="'+value+'"]');
        if(todayDom){
            addClass(todayDom,'today');
        }
    };


    /**
     * turn to next month
     * @param dom
     */
    liteCalendar.prototype.turnToNextMonth = function (dom){


        var month = dom.getAttribute('data-month');
        var year = dom.getAttribute('data-year');

        if(month == 11){
            month = 0;
            year = parseInt(year) + 1;
        }else{
            month = parseInt(month) + 1;
        }
        var d2= new Date();
        d2.setFullYear(parseInt(year),parseInt(month),1);

        this.init(dom,d2);
        this.removeToday(dom);
    };

    /**
     * turn to prev month
     * @param dom
     */
    liteCalendar.prototype.turnToPrevMonth = function (dom){

        var month = dom.getAttribute('data-month');
        var year = dom.getAttribute('data-year');

        if(month == 0){
            month = 11;
            year = parseInt(year) - 1;
        }else{
            month = parseInt(month) - 1;
        }
        var d2= new Date();
        d2.setFullYear(parseInt(year),parseInt(month),1);

        this.init(dom,d2);
        this.removeToday(dom);

    };

    liteCalendar.prototype.updateDate = function (d){
        if(!d) this.date = new Date();
        if(!this.initializedDate){
            this.oritoday = d;
            this.oridate = d.getDate();
            this.oriyear = d.getFullYear();
            this.orimonth = d.getMonth();
            this.initializedDate = true;
        }
        this.today = d;
        this.date = d.getDate();
        this.year = d.getFullYear();
        this.month = d.getMonth();
        if(this.year > this.oriyear || (this.year == this.oriyear && this.month > this.orimonth)){
            this.isFuture = true;
            this.isPast = false;
            this.isCurrent = false;
        }
        if(this.year < this.oriyear || (this.year == this.oriyear && this.month < this.orimonth)){
            this.isFuture = false;
            this.isPast = true;
            this.isCurrent = false;
        }
        if(this.year == this.oriyear && this.month == this.orimonth){
            this.isFuture = false;
            this.isPast = false;
            this.isCurrent = true;
        }

    };

    /**
     * to be overwritten
	 *
	 * override this method to customize your rule of highlighting , holiday markup, state disable
	 *
	 * 重写这个方法来指定你所需要的高亮，节假日，禁用日期的算法规则
	 *
     */
    liteCalendar.prototype.onAfterRefresh = function (dom,today,year,month,date) {

        var end,
            //url = serverUrlBase + 'getSignDays',
            that = this;
        if(this.isPast){
            end = getDaysOfMonth(year,month);

            var preArr =[];
            for(var i = 1;i <= end ; i++){
                preArr[i-1] = getCurrentMonthValue(year,month) + '-' + getDateValue(i);
            }
            //year = year;
            month = getMonthValue(month);
            this.setInactive(dom,preArr);
            /*request(url,{userId:userId,year:year,month:month,end:end}, function (msg) {

                var arr = msg.data;
                that.setActive(dom,arr);
            });*/
        }else if(this.isCurrent){
            end = this.oridate;
            //year = year;
            var preArr =[];
            for(var i = 1;i <= end ; i++){
                preArr[i-1] = getCurrentMonthValue(year,month) + '-' + getDateValue(i);
            }
            //year = year;
            month = getMonthValue(month);
            this.setInactive(dom,preArr);

            /*request(url,{userId:userId,year:year,month:month,end:end}, function (msg) {
                var arr = msg.data;
                that.setActive(dom,arr);
            });*/
        }

    };


    window.liteCalendar = liteCalendar;



}(window || this));