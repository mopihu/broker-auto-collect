module.exports = function BrokerAutoCollect(mod) {
  let listings = [];

  mod.hook('C_TRADE_BROKER_BUY_IT_NOW', 2, event => {
    listings.push(event.listing);
  })

  mod.hook('C_TRADE_BROKER_DEAL_CONFIRM', 1, event => {
    listings.push(event.listing);
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

  mod.hook('S_SYSTEM_MESSAGE', 1, event => {
    let msgObj = mod.parseSystemMessage(event.message);
    if (msgObj.id == 'SMT_MEDIATE_SUCCESS_BUY') {
      setTimeout(function() {
        mod.send('C_TRADE_BROKER_BOUGHT_ITEM_LIST', 1, {})
      }, 1000);
    }
  })
}
