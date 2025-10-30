package com.manzil.quranapp.data.model

import android.os.Parcelable
import kotlinx.parcelize.Parcelize

/**
 * Data class representing a Surah (Chapter) of the Quran
 * Contains all information about a specific Surah including its number,
 * names, revelation type, and verse count
 */
@Parcelize
data class Surah(
    val number: Int,
    val name: String,
    val englishName: String,
    val englishNameTranslation: String,
    val numberOfAyahs: Int,
    val revelationType: RevelationType,
    val isBookmarked: Boolean = false,
    val lastReadVerse: Int = 0,
    val progress: Float = 0f
) : Parcelable {
    
    /**
     * Get the display name based on language preference
     */
    fun getDisplayName(useArabic: Boolean = false): String {
        return if (useArabic) name else englishName
    }
    
    /**
     * Get the revelation type as a string resource
     */
    fun getRevelationTypeString(): String {
        return when (revelationType) {
            RevelationType.MECCAN -> "Meccan"
            RevelationType.MEDINAN -> "Medinan"
        }
    }
    
    /**
     * Check if this Surah has been started
     */
    fun isStarted(): Boolean = lastReadVerse > 0
    
    /**
     * Check if this Surah is completed
     */
    fun isCompleted(): Boolean = lastReadVerse >= numberOfAyahs
    
    /**
     * Get completion percentage
     */
    fun getCompletionPercentage(): Int {
        return if (numberOfAyahs > 0) {
            ((lastReadVerse.toFloat() / numberOfAyahs) * 100).toInt()
        } else 0
    }
    
    companion object {
        /**
         * Get all 114 Surahs of the Quran
         */
        fun getAllSurahs(): List<Surah> = listOf(
            Surah(1, "الفاتحة", "Al-Fatihah", "The Opening", 7, RevelationType.MECCAN),
            Surah(2, "البقرة", "Al-Baqarah", "The Cow", 286, RevelationType.MEDINAN),
            Surah(3, "آل عمران", "Ali 'Imran", "Family of Imran", 200, RevelationType.MEDINAN),
            Surah(4, "النساء", "An-Nisa", "The Women", 176, RevelationType.MEDINAN),
            Surah(5, "المائدة", "Al-Ma'idah", "The Table Spread", 120, RevelationType.MEDINAN),
            Surah(6, "الأنعام", "Al-An'am", "The Cattle", 165, RevelationType.MECCAN),
            Surah(7, "الأعراف", "Al-A'raf", "The Heights", 206, RevelationType.MECCAN),
            Surah(8, "الأنفال", "Al-Anfal", "The Spoils of War", 75, RevelationType.MEDINAN),
            Surah(9, "التوبة", "At-Tawbah", "The Repentance", 129, RevelationType.MEDINAN),
            Surah(10, "يونس", "Yunus", "Jonah", 109, RevelationType.MECCAN),
            Surah(11, "هود", "Hud", "Hud", 123, RevelationType.MECCAN),
            Surah(12, "يوسف", "Yusuf", "Joseph", 111, RevelationType.MECCAN),
            Surah(13, "الرعد", "Ar-Ra'd", "The Thunder", 43, RevelationType.MEDINAN),
            Surah(14, "ابراهيم", "Ibrahim", "Abraham", 52, RevelationType.MECCAN),
            Surah(15, "الحجر", "Al-Hijr", "The Rocky Tract", 99, RevelationType.MECCAN),
            Surah(16, "النحل", "An-Nahl", "The Bee", 128, RevelationType.MECCAN),
            Surah(17, "الإسراء", "Al-Isra", "The Night Journey", 111, RevelationType.MECCAN),
            Surah(18, "الكهف", "Al-Kahf", "The Cave", 110, RevelationType.MECCAN),
            Surah(19, "مريم", "Maryam", "Mary", 98, RevelationType.MECCAN),
            Surah(20, "طه", "Taha", "Ta-Ha", 135, RevelationType.MECCAN),
            Surah(21, "الأنبياء", "Al-Anbiya", "The Prophets", 112, RevelationType.MECCAN),
            Surah(22, "الحج", "Al-Hajj", "The Pilgrimage", 78, RevelationType.MEDINAN),
            Surah(23, "المؤمنون", "Al-Mu'minun", "The Believers", 118, RevelationType.MECCAN),
            Surah(24, "النور", "An-Nur", "The Light", 64, RevelationType.MEDINAN),
            Surah(25, "الفرقان", "Al-Furqan", "The Criterion", 77, RevelationType.MECCAN),
            Surah(26, "الشعراء", "Ash-Shu'ara", "The Poets", 227, RevelationType.MECCAN),
            Surah(27, "النمل", "An-Naml", "The Ant", 93, RevelationType.MECCAN),
            Surah(28, "القصص", "Al-Qasas", "The Stories", 88, RevelationType.MECCAN),
            Surah(29, "العنكبوت", "Al-'Ankabut", "The Spider", 69, RevelationType.MECCAN),
            Surah(30, "الروم", "Ar-Rum", "The Romans", 60, RevelationType.MECCAN),
            Surah(31, "لقمان", "Luqman", "Luqman", 34, RevelationType.MECCAN),
            Surah(32, "السجدة", "As-Sajdah", "The Prostration", 30, RevelationType.MECCAN),
            Surah(33, "الأحزاب", "Al-Ahzab", "The Combined Forces", 73, RevelationType.MEDINAN),
            Surah(34, "سبإ", "Saba", "Sheba", 54, RevelationType.MECCAN),
            Surah(35, "فاطر", "Fatir", "Originator", 45, RevelationType.MECCAN),
            Surah(36, "يس", "Ya-Sin", "Ya Sin", 83, RevelationType.MECCAN),
            Surah(37, "الصافات", "As-Saffat", "Those who set the Ranks", 182, RevelationType.MECCAN),
            Surah(38, "ص", "Sad", "The Letter Saad", 88, RevelationType.MECCAN),
            Surah(39, "الزمر", "Az-Zumar", "The Troops", 75, RevelationType.MECCAN),
            Surah(40, "غافر", "Ghafir", "The Forgiver", 85, RevelationType.MECCAN),
            Surah(41, "فصلت", "Fussilat", "Explained in Detail", 54, RevelationType.MECCAN),
            Surah(42, "الشورى", "Ash-Shuraa", "The Consultation", 53, RevelationType.MECCAN),
            Surah(43, "الزخرف", "Az-Zukhruf", "The Ornaments of Gold", 89, RevelationType.MECCAN),
            Surah(44, "الدخان", "Ad-Dukhan", "The Smoke", 59, RevelationType.MECCAN),
            Surah(45, "الجاثية", "Al-Jathiyah", "The Crouching", 37, RevelationType.MECCAN),
            Surah(46, "الأحقاف", "Al-Ahqaf", "The Wind-Curved Sandhills", 35, RevelationType.MECCAN),
            Surah(47, "محمد", "Muhammad", "Muhammad", 38, RevelationType.MEDINAN),
            Surah(48, "الفتح", "Al-Fath", "The Victory", 29, RevelationType.MEDINAN),
            Surah(49, "الحجرات", "Al-Hujurat", "The Rooms", 18, RevelationType.MEDINAN),
            Surah(50, "ق", "Qaf", "The Letter Qaf", 45, RevelationType.MECCAN),
            Surah(51, "الذاريات", "Adh-Dhariyat", "The Winnowing Winds", 60, RevelationType.MECCAN),
            Surah(52, "الطور", "At-Tur", "The Mount", 49, RevelationType.MECCAN),
            Surah(53, "النجم", "An-Najm", "The Star", 62, RevelationType.MECCAN),
            Surah(54, "القمر", "Al-Qamar", "The Moon", 55, RevelationType.MECCAN),
            Surah(55, "الرحمن", "Ar-Rahman", "The Beneficent", 78, RevelationType.MEDINAN),
            Surah(56, "الواقعة", "Al-Waqi'ah", "The Inevitable", 96, RevelationType.MECCAN),
            Surah(57, "الحديد", "Al-Hadid", "The Iron", 29, RevelationType.MEDINAN),
            Surah(58, "المجادلة", "Al-Mujadila", "The Pleading Woman", 22, RevelationType.MEDINAN),
            Surah(59, "الحشر", "Al-Hashr", "The Exile", 24, RevelationType.MEDINAN),
            Surah(60, "الممتحنة", "Al-Mumtahanah", "She that is to be examined", 13, RevelationType.MEDINAN),
            Surah(61, "الصف", "As-Saf", "The Ranks", 14, RevelationType.MEDINAN),
            Surah(62, "الجمعة", "Al-Jumu'ah", "Friday", 11, RevelationType.MEDINAN),
            Surah(63, "المنافقون", "Al-Munafiqun", "The Hypocrites", 11, RevelationType.MEDINAN),
            Surah(64, "التغابن", "At-Taghabun", "The Mutual Disillusion", 18, RevelationType.MEDINAN),
            Surah(65, "الطلاق", "At-Talaq", "The Divorce", 12, RevelationType.MEDINAN),
            Surah(66, "التحريم", "At-Tahrim", "The Prohibition", 12, RevelationType.MEDINAN),
            Surah(67, "الملك", "Al-Mulk", "The Sovereignty", 30, RevelationType.MECCAN),
            Surah(68, "القلم", "Al-Qalam", "The Pen", 52, RevelationType.MECCAN),
            Surah(69, "الحاقة", "Al-Haqqah", "The Reality", 52, RevelationType.MECCAN),
            Surah(70, "المعارج", "Al-Ma'arij", "The Ascending Stairways", 44, RevelationType.MECCAN),
            Surah(71, "نوح", "Nuh", "Noah", 28, RevelationType.MECCAN),
            Surah(72, "الجن", "Al-Jinn", "The Jinn", 28, RevelationType.MECCAN),
            Surah(73, "المزمل", "Al-Muzzammil", "The Enshrouded One", 20, RevelationType.MECCAN),
            Surah(74, "المدثر", "Al-Muddaththir", "The Cloaked One", 56, RevelationType.MECCAN),
            Surah(75, "القيامة", "Al-Qiyamah", "The Resurrection", 40, RevelationType.MECCAN),
            Surah(76, "الانسان", "Al-Insan", "The Man", 31, RevelationType.MEDINAN),
            Surah(77, "المرسلات", "Al-Mursalat", "The Emissaries", 50, RevelationType.MECCAN),
            Surah(78, "النبإ", "An-Naba", "The Tidings", 40, RevelationType.MECCAN),
            Surah(79, "النازعات", "An-Nazi'at", "Those who drag forth", 46, RevelationType.MECCAN),
            Surah(80, "عبس", "Abasa", "He Frowned", 42, RevelationType.MECCAN),
            Surah(81, "التكوير", "At-Takwir", "The Overthrowing", 29, RevelationType.MECCAN),
            Surah(82, "الإنفطار", "Al-Infitar", "The Cleaving", 19, RevelationType.MECCAN),
            Surah(83, "المطففين", "Al-Mutaffifin", "The Defrauding", 36, RevelationType.MECCAN),
            Surah(84, "الإنشقاق", "Al-Inshiqaq", "The Sundering", 25, RevelationType.MECCAN),
            Surah(85, "البروج", "Al-Buruj", "The Mansions of the Stars", 22, RevelationType.MECCAN),
            Surah(86, "الطارق", "At-Tariq", "The Nightcomer", 17, RevelationType.MECCAN),
            Surah(87, "الأعلى", "Al-A'la", "The Most High", 19, RevelationType.MECCAN),
            Surah(88, "الغاشية", "Al-Ghashiyah", "The Overwhelming", 26, RevelationType.MECCAN),
            Surah(89, "الفجر", "Al-Fajr", "The Dawn", 30, RevelationType.MECCAN),
            Surah(90, "البلد", "Al-Balad", "The City", 20, RevelationType.MECCAN),
            Surah(91, "الشمس", "Ash-Shams", "The Sun", 15, RevelationType.MECCAN),
            Surah(92, "الليل", "Al-Layl", "The Night", 21, RevelationType.MECCAN),
            Surah(93, "الضحى", "Ad-Duhaa", "The Morning Hours", 11, RevelationType.MECCAN),
            Surah(94, "الشرح", "Ash-Sharh", "The Relief", 8, RevelationType.MECCAN),
            Surah(95, "التين", "At-Tin", "The Fig", 8, RevelationType.MECCAN),
            Surah(96, "العلق", "Al-'Alaq", "The Clot", 19, RevelationType.MECCAN),
            Surah(97, "القدر", "Al-Qadr", "The Power", 5, RevelationType.MECCAN),
            Surah(98, "البينة", "Al-Bayyinah", "The Clear Proof", 8, RevelationType.MEDINAN),
            Surah(99, "الزلزلة", "Az-Zalzalah", "The Earthquake", 8, RevelationType.MEDINAN),
            Surah(100, "العاديات", "Al-'Adiyat", "The Courser", 11, RevelationType.MECCAN),
            Surah(101, "القارعة", "Al-Qari'ah", "The Calamity", 11, RevelationType.MECCAN),
            Surah(102, "التكاثر", "At-Takathur", "The Rivalry in world increase", 8, RevelationType.MECCAN),
            Surah(103, "العصر", "Al-'Asr", "The Declining Day", 3, RevelationType.MECCAN),
            Surah(104, "الهمزة", "Al-Humazah", "The Traducer", 9, RevelationType.MECCAN),
            Surah(105, "الفيل", "Al-Fil", "The Elephant", 5, RevelationType.MECCAN),
            Surah(106, "قريش", "Quraysh", "Quraysh", 4, RevelationType.MECCAN),
            Surah(107, "الماعون", "Al-Ma'un", "The Small kindnesses", 7, RevelationType.MECCAN),
            Surah(108, "الكوثر", "Al-Kawthar", "The Abundance", 3, RevelationType.MECCAN),
            Surah(109, "الكافرون", "Al-Kafirun", "The Disbelievers", 6, RevelationType.MECCAN),
            Surah(110, "النصر", "An-Nasr", "The Divine Support", 3, RevelationType.MEDINAN),
            Surah(111, "المسد", "Al-Masad", "The Palm Fiber", 5, RevelationType.MECCAN),
            Surah(112, "الإخلاص", "Al-Ikhlas", "The Sincerity", 4, RevelationType.MECCAN),
            Surah(113, "الفلق", "Al-Falaq", "The Daybreak", 5, RevelationType.MECCAN),
            Surah(114, "الناس", "An-Nas", "Mankind", 6, RevelationType.MECCAN)
        )
    }
}

/**
 * Enum class for Revelation Type
 */
enum class RevelationType {
    MECCAN,
    MEDINAN
}
