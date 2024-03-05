export function metersToMiles(visibilityInMeters:number):string {
    // 1 meter is approximately 0.000621371 miles
    
    if (visibilityInMeters==10000) {
      return "10mi"
    } 
    else {
      const visibilityInMiles = visibilityInMeters * 0.000621371
      return `${visibilityInMiles.toFixed(0)}mi` //rounfd to 0 decimal places and add 'mi' to unit
    }
  
}