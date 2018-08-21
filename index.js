module.exports = function BrokerAutoClaim(mod) {
  let listings = [];

  mod.hook('C_TRADE_BROKER_BUY_IT_NOW', 2, event => {
    listings.push(event.listing);
    setTimeout(function() {
      mod.send('C_TRADE_BROKER_BOUGHT_ITEM_LIST', 1, {})
    }, 1000);
  })

  mod.hook('S_TRADE_BROKER_BOUGHT_ITEM_LIST', 1, event => {
    event.purchases.forEach(function(item) {
      if (listings.includes(item.purchase)) {
        mod.send('C_TRADE_BROKER_CALC_BOUGHT_ITEM', 1, {
          unk1: 524289,
          unk2: 8,
          listing: item.purchase
        })
        listings.splice(item.purchase, 1);
      }
    })
  })
}
