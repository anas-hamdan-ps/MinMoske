import 'dart:async';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class MosqueDetailScreen extends StatefulWidget {
  final dynamic mosque;
  const MosqueDetailScreen({this.mosque, Key? key}) : super(key: key);

  @override
  State<MosqueDetailScreen> createState() => _MosqueDetailScreenState();
}

class _MosqueDetailScreenState extends State<MosqueDetailScreen> {
  late DateTime _now;
  Timer? _timer;
  String? _nextPrayer;
  Duration? _timeUntilNextPrayer;

  @override
  void initState() {
    super.initState();
    _now = DateTime.now();
    _timer = Timer.periodic(Duration(seconds: 1), (timer) {
      setState(() {
        _now = DateTime.now();
        _calculateNextPrayer();
      });
    });
    _calculateNextPrayer();
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  void _calculateNextPrayer() {
    final m = widget.mosque ?? {};
    final pt = m['prayerTimes'] ?? {};
    
    if (pt.isEmpty) return;

    final prayers = [
      {'name': 'Fajr', 'time': pt['fajr']},
      {'name': 'Dhuhr', 'time': pt['dhuhr']},
      {'name': 'Asr', 'time': pt['asr']},
      {'name': 'Maghrib', 'time': pt['maghrib']},
      {'name': 'Isha', 'time': pt['isha']},
    ];

    DateTime? nextPrayerTime;
    String? nextPrayerName;

    for (var prayer in prayers) {
      if (prayer['time'] != null && prayer['time'] != '-' && prayer['time'].toString().contains(':')) {
        try {
          final timeParts = prayer['time'].split(':');
          if (timeParts.length >= 2) {
            final prayerTime = DateTime(
              _now.year,
              _now.month,
              _now.day,
              int.parse(timeParts[0]),
              int.parse(timeParts[1]),
            );

            if (prayerTime.isAfter(_now)) {
              nextPrayerTime = prayerTime;
              nextPrayerName = prayer['name'];
              break;
            }
          }
        } catch (e) {
          // Skip invalid time formats
          print('Invalid time format for ${prayer['name']}: ${prayer['time']}');
        }
      }
    }

    // If no prayer found for today, check tomorrow's first prayer (Fajr)
    if (nextPrayerTime == null) {
      try {
        if (pt['fajr'] != null && pt['fajr'] != '-' && pt['fajr'].toString().contains(':')) {
          final timeParts = pt['fajr'].split(':');
          if (timeParts.length >= 2) {
            nextPrayerTime = DateTime(
              _now.year,
              _now.month,
              _now.day + 1,
              int.parse(timeParts[0]),
              int.parse(timeParts[1]),
            );
            nextPrayerName = 'Fajr';
          }
        }
      } catch (e) {
        // Skip invalid time formats
        print('Invalid Fajr time format: ${pt['fajr']}');
      }
    }

    if (nextPrayerTime != null && nextPrayerName != null) {
      _nextPrayer = nextPrayerName;
      _timeUntilNextPrayer = nextPrayerTime.difference(_now);
    } else {
      // If we still can't find a next prayer, just highlight the first available prayer
      for (var prayer in prayers) {
        if (prayer['time'] != null && prayer['time'] != '-' && prayer['time'].toString().contains(':')) {
          _nextPrayer = prayer['name'];
          break;
        }
      }
    }
  }

  String _formatDuration(Duration duration) {
    if (duration.isNegative) return '00:00:00';
    
    int hours = duration.inHours;
    int minutes = duration.inMinutes.remainder(60);
    int seconds = duration.inSeconds.remainder(60);
    
    return '${hours.toString().padLeft(2, '0')}:${minutes.toString().padLeft(2, '0')}:${seconds.toString().padLeft(2, '0')}';
  }

  bool _isCurrentPrayer(String prayerName) {
    if (_nextPrayer == null) return false;
    
    // Highlight the next prayer regardless of time
    if (_nextPrayer == prayerName) {
      return true;
    }
    
    return false;
  }

  @override
  Widget build(BuildContext context) {
    final m = widget.mosque ?? ModalRoute.of(context)!.settings.arguments;
    final pt = m['prayerTimes'] ?? {};

    return Scaffold(
      backgroundColor: Colors.black,
      body: Container(
        decoration: BoxDecoration(
          image: DecorationImage(
            image: AssetImage('assets/VR-17.jpg'),
            fit: BoxFit.cover,
            colorFilter: ColorFilter.mode(
              Colors.black.withOpacity(0.3),
              BlendMode.darken,
            ),
          ),
        ),
        child: SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // City and date
                Text(
                  m['city'] ?? '',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 28,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                SizedBox(height: 4),
                Text(
                  DateFormat('EEEE d MMMM yyyy').format(_now),
                  style: TextStyle(
                    color: Colors.white70,
                    fontSize: 18,
                  ),
                ),
                SizedBox(height: 30),

                // Current time
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      DateFormat('HH:mm').format(_now),
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 64,
                        fontWeight: FontWeight.bold,
                        letterSpacing: 2,
                      ),
                    ),
                    Padding(
                      padding: EdgeInsets.only(top: 8),
                      child: Text(
                        DateFormat('ss').format(_now),
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 24,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ),
                  ],
                ),
                SizedBox(height: 20),

                // Countdown to next prayer
                if (_nextPrayer != null && _timeUntilNextPrayer != null) ...[
                  Container(
                    width: 120,
                    height: 120,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: Colors.white.withOpacity(0.15),
                      border: Border.all(color: Colors.white.withOpacity(0.3), width: 2),
                    ),
                    child: Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(
                            'Next: $_nextPrayer',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 14,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                          SizedBox(height: 8),
                          Text(
                            _formatDuration(_timeUntilNextPrayer!),
                            style: TextStyle(
                              color: Colors.orange,
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                              fontFamily: 'monospace',
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  SizedBox(height: 30),
                ],

                // Prayer times
                _buildPrayerTimeRow("Fajr", pt['fajr'], _isCurrentPrayer("Fajr")),
                _buildPrayerTimeRow("Dhuhr", pt['dhuhr'], _isCurrentPrayer("Dhuhr")),
                _buildPrayerTimeRow("Asr", pt['asr'], _isCurrentPrayer("Asr")),
                _buildPrayerTimeRow("Maghrib", pt['maghrib'], _isCurrentPrayer("Maghrib")),
                _buildPrayerTimeRow("Isha", pt['isha'], _isCurrentPrayer("Isha")),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildPrayerTimeRow(String name, String? time, bool isHighlighted) {
    return Container(
      margin: EdgeInsets.symmetric(vertical: 6),
      padding: EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isHighlighted ? Colors.orange.withOpacity(0.3) : Colors.white.withOpacity(0.1),
        borderRadius: BorderRadius.circular(16),
        border: isHighlighted ? Border.all(color: Colors.orange, width: 2) : Border.all(color: Colors.white.withOpacity(0.2)),
      ),
      child: Row(
        children: [
          // Prayer name on the left
          Expanded(
            child: Text(
              name,
              style: TextStyle(
                color: isHighlighted ? Colors.orange : Colors.white,
                fontSize: 22,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
          
          // Prayer time on the right
          Text(
            time ?? '-',
            style: TextStyle(
              color: isHighlighted ? Colors.orange : Colors.white70,
              fontSize: 18,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }
}
