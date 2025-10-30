package com.manzil.quranapp.data.model

import android.os.Parcelable
import kotlinx.parcelize.Parcelize

/**
 * Data class representing a single Verse (Ayah) from the Quran
 * Contains the Arabic text, translation, transliteration, and metadata
 */
@Parcelize
data class Verse(
    val number: Int,              // Global verse number (1-6236)
    val numberInSurah: Int,       // Verse number within the Surah
    val surahNumber: Int,         // Surah number (1-114)
    val text: String,             // Arabic text
    val translation: String,      // English translation
    val transliteration: String,  // Romanized text
    val audioUrl: String? = null, // URL for verse audio
    val juz: Int = 0,            // Juz number (1-30)
    val page: Int = 0,           // Page number in Quran
    val isBookmarked: Boolean = false,
    val tafsir: String? = null   // Tafsir (commentary/explanation)
) : Parcelable {
    
    /**
     * Get formatted verse reference (Surah:Verse)
     */
    fun getReference(): String = "$surahNumber:$numberInSurah"
    
    /**
     * Check if verse has audio
     */
    fun hasAudio(): Boolean = !audioUrl.isNullOrEmpty()
    
    /**
     * Check if verse has tafsir
     */
    fun hasTafsir(): Boolean = !tafsir.isNullOrEmpty()
    
    /**
     * Get audio URL for this verse
     */
    fun getAudioUrl(reciterId: String): String {
        val paddedSurah = surahNumber.toString().padStart(3, '0')
        val paddedVerse = numberInSurah.toString().padStart(3, '0')
        
        val reciterUrls = mapOf(
            "mishary" to "https://everyayah.com/data/Alafasy_128kbps",
            "abdulbasit" to "https://everyayah.com/data/Abdul_Basit_Murattal_192kbps",
            "sudais" to "https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps",
            "husary" to "https://everyayah.com/data/Husary_128kbps",
            "ghamadi" to "https://everyayah.com/data/Ghamadi_40kbps",
            "minshawi" to "https://everyayah.com/data/Minshawi_Murattal_128kbps",
            "shuraim" to "https://everyayah.com/data/Shuraym_128kbps",
            "ajmy" to "https://everyayah.com/data/Ahmed_ibn_Ali_al-Ajamy_128kbps"
        )
        
        val baseUrl = reciterUrls[reciterId] ?: reciterUrls["mishary"]!!
        return "$baseUrl/$paddedSurah$paddedVerse.mp3"
    }
    
    /**
     * Get share text for this verse
     */
    fun getShareText(surahName: String): String {
        return """
            $text
            
            $translation
            
            — $surahName ($surahNumber:$numberInSurah)
            
            Shared from Manzil Quran App
        """.trimIndent()
    }
    
    companion object {
        /**
         * Create a sample/placeholder verse
         */
        fun createPlaceholder(surahNumber: Int, verseNumber: Int): Verse {
            return Verse(
                number = 0,
                numberInSurah = verseNumber,
                surahNumber = surahNumber,
                text = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
                translation = "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
                transliteration = "Bismillah ir-Rahman ir-Raheem",
                audioUrl = null,
                juz = 1,
                page = 1
            )
        }
    }
}

/**
 * Data class for verse search results
 */
@Parcelize
data class VerseSearchResult(
    val verse: Verse,
    val surahName: String,
    val highlightedText: String,
    val relevanceScore: Float = 0f
) : Parcelable

/**
 * Data class for verse range (used for reading sessions)
 */
@Parcelize
data class VerseRange(
    val startSurah: Int,
    val startVerse: Int,
    val endSurah: Int,
    val endVerse: Int
) : Parcelable {
    
    /**
     * Check if a verse is within this range
     */
    fun contains(surahNumber: Int, verseNumber: Int): Boolean {
        return when {
            surahNumber < startSurah || surahNumber > endSurah -> false
            surahNumber == startSurah && verseNumber < startVerse -> false
            surahNumber == endSurah && verseNumber > endVerse -> false
            else -> true
        }
    }
    
    /**
     * Get formatted range string
     */
    fun getFormattedRange(): String {
        return if (startSurah == endSurah) {
            "$startSurah:$startVerse-$endVerse"
        } else {
            "$startSurah:$startVerse - $endSurah:$endVerse"
        }
    }
}
