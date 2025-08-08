import 'package:flutter/material.dart';

class MosqueDetailScreen extends StatelessWidget {
  final dynamic mosque;
  MosqueDetailScreen({this.mosque});

  @override
  Widget build(BuildContext context) {
    final m = mosque ?? ModalRoute.of(context)!.settings.arguments;
    final pt = m['prayerTimes'] ?? {};
    return Scaffold(
      appBar: AppBar(title: Text(m['name'] ?? 'Mosque')),
      body: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(m['city'] ?? '', style: TextStyle(fontSize: 16)),
            SizedBox(height: 12),
            Text('Prayer Times', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
            SizedBox(height: 8),
            Text('Fajr: ${pt['fajr'] ?? '-'}'),
            Text('Dhuhr: ${pt['dhuhr'] ?? '-'}'),
            Text('Asr: ${pt['asr'] ?? '-'}'),
            Text('Maghrib: ${pt['maghrib'] ?? '-'}'),
            Text('Isha: ${pt['isha'] ?? '-'}'),
          ],
        ),
      ),
    );
  }
}
