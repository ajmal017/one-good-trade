Template.pnl.helpers({
  orders: function() {
    return Orders.find({},{
      sort : { date : 1 }
    });
  },
});

Template.pnl.events({
  
});

Template.orderDetails.helpers({
  total_fees : function() {
    return float(this.commision) + float(this.other_fees);
  },

  date_formatted : function() {
    return moment(this.date).format("YYYY-MM-DD");
  }
})