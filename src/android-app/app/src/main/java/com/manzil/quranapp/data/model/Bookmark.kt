package com.manzil.quranapp.data.model

import android.os.Parcelable
import kotlinx.parcelize.Parcelize
import java.util.Date

/**
 * Data class representing a bookmarked verse
 * Allows users to save and quickly access their favorite verses
 */
@Parcelize
data class Bookmark(
    val id: Long = 0,
    val surahNumber: Int,
    val verseNumber: Int,
    val surahName: String,
    val surahEnglishName: String,
    val verseText: String,
    val verseTranslation: String,
    val note: String? = null,
    val tags: List<String> = emptyList(),
    val createdAt: Long = System.currentTimeMillis(),
    val lastAccessedAt: Long = System.currentTimeMillis(),
    val color: BookmarkColor = BookmarkColor.DEFAULT
) : Parcelable {
    
    /**
     * Get formatted reference (e.g., "2:255")
     */
    fun getReference(): String = "$surahNumber:$verseNumber"
    
    /**
     * Get full reference with Surah name
     */
    fun getFullReference(): String = "$surahEnglishName ($surahNumber:$verseNumber)"
    
    /**
     * Check if bookmark has note
     */
    fun hasNote(): Boolean = !note.isNullOrBlank()
    
    /**
     * Check if bookmark has tags
     */
    fun hasTags(): Boolean = tags.isNotEmpty()
    
    /**
     * Get formatted creation date
     */
    fun getFormattedCreatedDate(): String {
        val date = Date(createdAt)
        return android.text.format.DateFormat.format("MMM dd, yyyy", date).toString()
    }
    
    /**
     * Get time since creation
     */
    fun getTimeSinceCreation(): String {
        val now = System.currentTimeMillis()
        val diff = now - createdAt
        
        val seconds = diff / 1000
        val minutes = seconds / 60
        val hours = minutes / 60
        val days = hours / 24
        
        return when {
            days > 0 -> "$days ${if (days == 1L) "day" else "days"} ago"
            hours > 0 -> "$hours ${if (hours == 1L) "hour" else "hours"} ago"
            minutes > 0 -> "$minutes ${if (minutes == 1L) "minute" else "minutes"} ago"
            else -> "Just now"
        }
    }
    
    /**
     * Create a copy with updated last accessed time
     */
    fun updateLastAccessed(): Bookmark {
        return copy(lastAccessedAt = System.currentTimeMillis())
    }
}

/**
 * Enum for bookmark colors/categories
 */
enum class BookmarkColor(val colorRes: Int) {
    DEFAULT(0),
    RED(1),
    ORANGE(2),
    YELLOW(3),
    GREEN(4),
    BLUE(5),
    PURPLE(6),
    PINK(7)
}

/**
 * Data class for bookmark statistics
 */
@Parcelize
data class BookmarkStatistics(
    val totalBookmarks: Int,
    val bookmarksThisWeek: Int,
    val bookmarksThisMonth: Int,
    val mostBookmarkedSurah: String?,
    val mostUsedTag: String?,
    val oldestBookmark: Bookmark?,
    val newestBookmark: Bookmark?
) : Parcelable

/**
 * Data class for bookmark filter options
 */
data class BookmarkFilter(
    val surahNumber: Int? = null,
    val color: BookmarkColor? = null,
    val tag: String? = null,
    val searchQuery: String? = null,
    val sortBy: BookmarkSortOrder = BookmarkSortOrder.DATE_CREATED_DESC
)

/**
 * Enum for bookmark sorting options
 */
enum class BookmarkSortOrder {
    DATE_CREATED_ASC,
    DATE_CREATED_DESC,
    DATE_ACCESSED_ASC,
    DATE_ACCESSED_DESC,
    SURAH_NUMBER_ASC,
    SURAH_NUMBER_DESC,
    VERSE_NUMBER_ASC,
    VERSE_NUMBER_DESC
}

/**
 * Extension function to sort bookmarks
 */
fun List<Bookmark>.sortBy(order: BookmarkSortOrder): List<Bookmark> {
    return when (order) {
        BookmarkSortOrder.DATE_CREATED_ASC -> sortedBy { it.createdAt }
        BookmarkSortOrder.DATE_CREATED_DESC -> sortedByDescending { it.createdAt }
        BookmarkSortOrder.DATE_ACCESSED_ASC -> sortedBy { it.lastAccessedAt }
        BookmarkSortOrder.DATE_ACCESSED_DESC -> sortedByDescending { it.lastAccessedAt }
        BookmarkSortOrder.SURAH_NUMBER_ASC -> sortedBy { it.surahNumber }
        BookmarkSortOrder.SURAH_NUMBER_DESC -> sortedByDescending { it.surahNumber }
        BookmarkSortOrder.VERSE_NUMBER_ASC -> sortedBy { it.verseNumber }
        BookmarkSortOrder.VERSE_NUMBER_DESC -> sortedByDescending { it.verseNumber }
    }
}

/**
 * Extension function to filter bookmarks
 */
fun List<Bookmark>.applyFilter(filter: BookmarkFilter): List<Bookmark> {
    var filtered = this
    
    filter.surahNumber?.let { surahNum ->
        filtered = filtered.filter { it.surahNumber == surahNum }
    }
    
    filter.color?.let { color ->
        filtered = filtered.filter { it.color == color }
    }
    
    filter.tag?.let { tag ->
        filtered = filtered.filter { it.tags.contains(tag) }
    }
    
    filter.searchQuery?.let { query ->
        if (query.isNotBlank()) {
            filtered = filtered.filter {
                it.verseText.contains(query, ignoreCase = true) ||
                it.verseTranslation.contains(query, ignoreCase = true) ||
                it.surahName.contains(query, ignoreCase = true) ||
                it.surahEnglishName.contains(query, ignoreCase = true) ||
                it.note?.contains(query, ignoreCase = true) == true
            }
        }
    }
    
    return filtered.sortBy(filter.sortBy)
}
