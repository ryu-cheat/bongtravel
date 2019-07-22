const WorkPool = require('work-pool')

export const ImageUpload = WorkPool(3)
export const TravelManageLoadFinishCheck = WorkPool(10)
export const TravelMainLoadFinishCheck = WorkPool(10)
