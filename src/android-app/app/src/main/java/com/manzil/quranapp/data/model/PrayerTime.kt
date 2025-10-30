package com.manzil.quranapp.data.model

import android.os.Parcelable
import kotlinx.parcelize.Parcelize
import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Date
import java.util.Locale

/**
 * Data class representing prayer times for a specific date
 */
@Parcelize
data class PrayerTime(
    val date: Long,              // Date in milliseconds
    val fajr: String,            // Format: "HH:mm"
    val sunrise: String,
    val dhuhr: String,
    val asr: String,
    val maghrib: String,
    val isha: String,
    val city: String = "",
    val country: String = "",
    val method: CalculationMethod = CalculationMethod.MWL
) : Parcelable {
    
    /**
     * Get all prayer times as a map
     */
    fun getAllPrayers(): Map<PrayerType, String> = mapOf(
        PrayerType.FAJR to fajr,
        PrayerType.SUNRISE to sunrise,
        PrayerType.DHUHR to dhuhr,
        PrayerType.ASR to asr,
        PrayerType.MAGHRIB to maghrib,
        PrayerType.ISHA to isha
    )
    
    /**
     * Get next prayer from current time
     */
    fun getNextPrayer(currentTime: Calendar = Calendar.getInstance()): Pair<PrayerType, String>? {
        val currentTimeStr = SimpleDateFormat("HH:mm", Locale.getDefault()).format(currentTime.time)
        
        val prayers = listOf(
            PrayerType.FAJR to fajr,
            PrayerType.SUNRISE to sunrise,
            PrayerType.DHUHR to dhuhr,
            PrayerType.ASR to asr,
            PrayerType.MAGHRIB to maghrib,
            PrayerType.ISHA to isha
        )
        
        for (prayer in prayers) {
            if (prayer.second > currentTimeStr) {
                return prayer
            }
        }
        
        return null // All prayers passed, next is tomorrow's Fajr
    }
    
    /**
     * Get current prayer (the last prayer that has passed)
     */
    fun getCurrentPrayer(currentTime: Calendar = Calendar.getInstance()): Pair<PrayerType, String>? {
        val currentTimeStr = SimpleDateFormat("HH:mm", Locale.getDefault()).format(currentTime.time)
        
        val prayers = listOf(
            PrayerType.ISHA to isha,
            PrayerType.MAGHRIB to maghrib,
            PrayerType.ASR to asr,
            PrayerType.DHUHR to dhuhr,
            PrayerType.SUNRISE to sunrise,
            PrayerType.FAJR to fajr
        ).reversed()
        
        for (prayer in prayers) {
            if (prayer.second <= currentTimeStr) {
                return prayer
            }
        }
        
        return prayers.lastOrNull() // Default to Fajr if before all prayers
    }
    
    /**
     * Get time remaining until next prayer
     */
    fun getTimeUntilNextPrayer(currentTime: Calendar = Calendar.getInstance()): String {
        val nextPrayer = getNextPrayer(currentTime) ?: return "Tomorrow"
        
        val prayerTimeParts = nextPrayer.second.split(":")
        val prayerHour = prayerTimeParts[0].toInt()
        val prayerMinute = prayerTimeParts[1].toInt()
        
        val prayerCalendar = Calendar.getInstance().apply {
            set(Calendar.HOUR_OF_DAY, prayerHour)
            set(Calendar.MINUTE, prayerMinute)
            set(Calendar.SECOND, 0)
        }
        
        val diffInMillis = prayerCalendar.timeInMillis - currentTime.timeInMillis
        val hours = (diffInMillis / (1000 * 60 * 60)).toInt()
        val minutes = ((diffInMillis / (1000 * 60)) % 60).toInt()
        
        return when {
            hours > 0 -> "${hours}h ${minutes}m"
            minutes > 0 -> "${minutes}m"
            else -> "Now"
        }
    }
    
    /**
     * Get formatted date
     */
    fun getFormattedDate(): String {
        val dateFormat = SimpleDateFormat("EEEE, MMM dd, yyyy", Locale.getDefault())
        return dateFormat.format(Date(date))
    }
    
    /**
     * Check if this is today's prayer time
     */
    fun isToday(): Boolean {
        val today = Calendar.getInstance()
        val thisDate = Calendar.getInstance().apply { timeInMillis = date }
        
        return today.get(Calendar.YEAR) == thisDate.get(Calendar.YEAR) &&
                today.get(Calendar.DAY_OF_YEAR) == thisDate.get(Calendar.DAY_OF_YEAR)
    }
}

/**
 * Enum for prayer types
 */
enum class PrayerType(val displayName: String, val arabicName: String) {
    FAJR("Fajr", "الفجر"),
    SUNRISE("Sunrise", "الشروق"),
    DHUHR("Dhuhr", "الظهر"),
    ASR("Asr", "العصر"),
    MAGHRIB("Maghrib", "المغرب"),
    ISHA("Isha", "العشاء");
    
    /**
     * Check if this is an obligatory prayer (not sunrise)
     */
    fun isObligatory(): Boolean = this != SUNRISE
}

/**
 * Enum for calculation methods
 */
enum class CalculationMethod(
    val displayName: String,
    val fajrAngle: Double,
    val ishaAngle: Double
) {
    MWL("Muslim World League", 18.0, 17.0),
    ISNA("Islamic Society of North America", 15.0, 15.0),
    EGYPT("Egyptian General Authority", 19.5, 17.5),
    MAKKAH("Umm Al-Qura University, Makkah", 18.5, 90.0),
    KARACHI("University of Islamic Sciences, Karachi", 18.0, 18.0),
    TEHRAN("Institute of Geophysics, University of Tehran", 17.7, 14.0),
    JAFARI("Shia Ithna-Ashari", 16.0, 14.0)
}

/**
 * Data class for location coordinates
 */
@Parcelize
data class LocationCoordinates(
    val latitude: Double,
    val longitude: Double,
    val city: String = "",
    val country: String = "",
    val timezone: String = ""
) : Parcelable {
    
    /**
     * Get formatted coordinates
     */
    fun getFormattedCoordinates(): String {
        val latDir = if (latitude >= 0) "N" else "S"
        val lonDir = if (longitude >= 0) "E" else "W"
        
        return String.format(
            Locale.US,
            "%.4f° %s, %.4f° %s",
            kotlin.math.abs(latitude), latDir,
            kotlin.math.abs(longitude), lonDir
        )
    }
    
    /**
     * Get location display name
     */
    fun getDisplayName(): String {
        return when {
            city.isNotEmpty() && country.isNotEmpty() -> "$city, $country"
            city.isNotEmpty() -> city
            country.isNotEmpty() -> country
            else -> getFormattedCoordinates()
        }
    }
}

/**
 * Data class for Qibla direction
 */
@Parcelize
data class QiblaDirection(
    val direction: Float,          // Degrees from North (0-360)
    val distanceKm: Double,        // Distance to Kaaba in kilometers
    val userLocation: LocationCoordinates
) : Parcelable {
    
    companion object {
        // Kaaba coordinates
        const val KAABA_LATITUDE = 21.4225
        const val KAABA_LONGITUDE = 39.8262
    }
    
    /**
     * Get formatted direction
     */
    fun getFormattedDirection(): String {
        val compassDirection = when (direction.toInt()) {
            in 0..22, in 338..360 -> "North"
            in 23..67 -> "Northeast"
            in 68..112 -> "East"
            in 113..157 -> "Southeast"
            in 158..202 -> "South"
            in 203..247 -> "Southwest"
            in 248..292 -> "West"
            in 293..337 -> "Northwest"
            else -> "Unknown"
        }
        
        return "$compassDirection (${direction.toInt()}°)"
    }
    
    /**
     * Get formatted distance
     */
    fun getFormattedDistance(): String {
        return String.format(Locale.US, "%.2f km", distanceKm)
    }
}

/**
 * Data class for prayer notification settings
 */
@Parcelize
data class PrayerNotificationSettings(
    val fajrEnabled: Boolean = true,
    val dhuhrEnabled: Boolean = true,
    val asrEnabled: Boolean = true,
    val maghribEnabled: Boolean = true,
    val ishaEnabled: Boolean = true,
    val adhanSound: String = "default",
    val vibrate: Boolean = true,
    val notifyBeforeMinutes: Int = 0  // 0 = exactly at prayer time
) : Parcelable {
    
    /**
     * Check if prayer notification is enabled
     */
    fun isPrayerEnabled(prayerType: PrayerType): Boolean {
        return when (prayerType) {
            PrayerType.FAJR -> fajrEnabled
            PrayerType.DHUHR -> dhuhrEnabled
            PrayerType.ASR -> asrEnabled
            PrayerType.MAGHRIB -> maghribEnabled
            PrayerType.ISHA -> ishaEnabled
            PrayerType.SUNRISE -> false
        }
    }
}
