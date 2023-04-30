# viznx-backend

Version 1.0.0

Todo List (The list may change on dev)

##### To create
- [ ] Queue Schema
- [ ] Group Schema


##### To complete

- [ ] Customer Schema
- [ ] Admin Schema
- [ ] Operator Schema
- [ ] Ads Schema


we need to update the customer scheme also

updating devices 
- given a device array with id's
- firstly go to all devices with a matching ad given
- if currDevice is not found in the current device array 
  and it has matching ad id , then make the adFrequncy to 
  0 inn all of the slots
- update a devices like addDevices with slotsWithFrequncis
- update the devicesObj with new One 
- create a combinationDeployedDevices
- go to the ad object under adsUnderOperator
- in the deployedDevices , delete all the unmatching devices or make frequcny to zero to make it ended
- add new devices to the deployedDevices


db.customers.updateMany({},{$set:{deviceWithAds:[] } })


db.operators.updateMany({}, { $set: { adsUnderOperator: [] } })


db.devices.updateMany({}, { $set: { slots: [       {         name: "slotOne",         queue: [],       },       {         name: "slotTwo",         queue: [],       },       {         name: "slotThree",         queue: [],       },       {         name: "slotFour",         queue: [],       },       {         name: "slotFive",         queue: [],       },       {         name: "slotSix",         queue: [],       },       {         name: "slotSeven",         queue: [],       },       {         name: "slotEight",         queue: [],       },       {         name: "slotNine",         queue: [],       },       {         name: "slotTen",         queue: [],       },     ] } })
