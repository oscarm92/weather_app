export function convertWindSpeed(speedInMetersPerSecond: number): string {
    // 1 kilometer per hour is approximately 0.621371 miles per hour
    const speedInMilesPerHour = speedInMetersPerSecond* 0.621371
    return `${speedInMilesPerHour.toFixed(0)}mi/h`
}