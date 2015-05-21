window.addEventListener('load', function() {
    'use strict';

    var tabView = new jsTabView('.tabView1');

    tabView.addTab('tab1', 'hola there');
    tabView.addTab('tab2', '<h1>some title</h1>');
    tabView.addTab('tab3', 'strange text');

});