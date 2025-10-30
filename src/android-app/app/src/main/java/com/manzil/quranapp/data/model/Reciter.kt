package com.manzil.quranapp.data.model

import android.os.Parcelable
import kotlinx.parcelize.Parcelize

/**
 * Data class representing a Quran reciter
 */
@Parcelize
data class Reciter(
    val id: String,
    val name: String,
    val arabicName: String = "",
    val style: RecitationStyle = RecitationStyle.MURATTAL,
    val language: String = "ar",
    val description: String = "",
    val imageUrl: String? = null,
    val isPopular: Boolean = false,
    val audioQuality: AudioQuality = AudioQuality.MEDIUM
) : Parcelable {
    
    /**
     * Get the base URL for this reciter's audio files
     */
    fun getBaseAudioUrl(): String {
        return when (id) {
            "mishary" -> "https://server8.mp3quran.net/afs"
            "abdulbasit" -> "https://server7.mp3quran.net/basit"
            "sudais" -> "https://server11.mp3quran.net/sds"
            "husary" -> "https://server8.mp3quran.net/hsr"
            "ghamadi" -> "https://server10.mp3quran.net/s_gmd"
            "minshawi" -> "https://server10.mp3quran.net/minsh"
            "shuraim" -> "https://server11.mp3quran.net/shr"
            "ajmy" -> "https://server10.mp3quran.net/ajm"
            else -> "https://server8.mp3quran.net/afs"
        }
    }
    
    /**
     * Get audio URL for a specific Surah
     */
    fun getSurahAudioUrl(surahNumber: Int): String {
        val paddedNumber = surahNumber.toString().padStart(3, '0')
        return "${getBaseAudioUrl()}/$paddedNumber.mp3"
    }
    
    /**
     * Get verse-by-verse audio URL
     */
    fun getVerseAudioUrl(surahNumber: Int, verseNumber: Int): String {
        val paddedSurah = surahNumber.toString().padStart(3, '0')
        val paddedVerse = verseNumber.toString().padStart(3, '0')
        
        val verseBaseUrls = mapOf(
            "mishary" to "https://everyayah.com/data/Alafasy_128kbps",
            "abdulbasit" to "https://everyayah.com/data/Abdul_Basit_Murattal_192kbps",
            "sudais" to "https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps",
            "husary" to "https://everyayah.com/data/Husary_128kbps",
            "ghamadi" to "https://everyayah.com/data/Ghamadi_40kbps",
            "minshawi" to "https://everyayah.com/data/Minshawi_Murattal_128kbps",
            "shuraim" to "https://everyayah.com/data/Shuraym_128kbps",
            "ajmy" to "https://everyayah.com/data/Ahmed_ibn_Ali_al-Ajamy_128kbps"
        )
        
        val baseUrl = verseBaseUrls[id] ?: verseBaseUrls["mishary"]!!
        return "$baseUrl/$paddedSurah$paddedVerse.mp3"
    }
    
    companion object {
        /**
         * Get all available reciters
         */
        fun getAllReciters(): List<Reciter> = listOf(
            Reciter(
                id = "mishary",
                name = "Mishary Rashid Alafasy",
                arabicName = "مشاري بن راشد العفاسي",
                style = RecitationStyle.MURATTAL,
                isPopular = true,
                audioQuality = AudioQuality.HIGH
            ),
            Reciter(
                id = "abdulbasit",
                name = "Abdul Basit Abdul Samad",
                arabicName = "عبد الباسط عبد الصمد",
                style = RecitationStyle.MURATTAL,
                isPopular = true,
                audioQuality = AudioQuality.HIGH
            ),
            Reciter(
                id = "sudais",
                name = "Abdur-Rahman As-Sudais",
                arabicName = "عبد الرحمن السديس",
                style = RecitationStyle.MURATTAL,
                isPopular = true,
                audioQuality = AudioQuality.HIGH
            ),
            Reciter(
                id = "husary",
                name = "Mahmoud Khalil Al-Husary",
                arabicName = "محمود خليل الحصري",
                style = RecitationStyle.MURATTAL,
                isPopular = true,
                audioQuality = AudioQuality.HIGH
            ),
            Reciter(
                id = "ghamadi",
                name = "Saad Al-Ghamdi",
                arabicName = "سعد الغامدي",
                style = RecitationStyle.MURATTAL,
                isPopular = false,
                audioQuality = AudioQuality.LOW
            ),
            Reciter(
                id = "minshawi",
                name = "Mohamed Siddiq Al-Minshawi",
                arabicName = "محمد صديق المنشاوي",
                style = RecitationStyle.MUJAWWAD,
                isPopular = true,
                audioQuality = AudioQuality.HIGH
            ),
            Reciter(
                id = "shuraim",
                name = "Sa'ud Ash-Shuraim",
                arabicName = "سعود الشريم",
                style = RecitationStyle.MURATTAL,
                isPopular = false,
                audioQuality = AudioQuality.HIGH
            ),
            Reciter(
                id = "ajmy",
                name = "Ahmed ibn Ali al-Ajamy",
                arabicName = "أحمد بن علي العجمي",
                style = RecitationStyle.MURATTAL,
                isPopular = false,
                audioQuality = AudioQuality.HIGH
            )
        )
        
        /**
         * Get reciter by ID
         */
        fun getReciterById(id: String): Reciter? {
            return getAllReciters().find { it.id == id }
        }
        
        /**
         * Get popular reciters
         */
        fun getPopularReciters(): List<Reciter> {
            return getAllReciters().filter { it.isPopular }
        }
    }
}

/**
 * Enum for recitation styles
 */
enum class RecitationStyle {
    MURATTAL,     // Slow, measured recitation
    MUJAWWAD,     // Melodic recitation with tajweed
    MUALLIM       // Teaching/learning style
}

/**
 * Enum for audio quality
 */
enum class AudioQuality {
    LOW,
    MEDIUM,
    HIGH,
    VERY_HIGH
}

/**
 * Data class for download progress
 */
data class DownloadProgress(
    val surahNumber: Int,
    val reciterId: String,
    val progress: Int,  // 0-100
    val downloadedBytes: Long,
    val totalBytes: Long,
    val status: DownloadStatus
)

/**
 * Enum for download status
 */
enum class DownloadStatus {
    PENDING,
    DOWNLOADING,
    COMPLETED,
    FAILED,
    CANCELLED,
    PAUSED
}
