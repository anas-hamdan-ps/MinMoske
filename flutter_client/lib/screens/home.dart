import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'mosque_detail.dart';
import '../config.dart';

class HomeScreen extends StatefulWidget {
  @override
  _HomeScreenState createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  List mosques = [];
  bool loading = true;
  final TextEditingController _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    determinePosition().then((pos) => fetchMosques(pos.latitude, pos.longitude));
  }

  Future<Position> determinePosition() async {
    bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      throw Exception('Location services are disabled.');
    }
    LocationPermission permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) {
        throw Exception('Location permissions are denied');
      }
    }
    if (permission == LocationPermission.deniedForever) {
      throw Exception('Location permissions are permanently denied.');
    }
    return await Geolocator.getCurrentPosition();
  }

  Future<void> fetchMosques(double lat, double lng) async {
    final api = '$apiBase/api/mosques?lat=$lat&lng=$lng&radiusKm=25';
    final response = await http.get(Uri.parse(api));
    if (response.statusCode == 200) {
      setState(() {
        mosques = json.decode(response.body);
        loading = false;
      });
    } else {
      setState(() => loading = false);
    }
  }

  Future<void> searchMosques(String query) async {
    setState(() => loading = true);
    final api = '$apiBase/api/mosques?q=${Uri.encodeQueryComponent(query)}';
    final response = await http.get(Uri.parse(api));
    if (response.statusCode == 200) {
      setState(() {
        mosques = json.decode(response.body);
        loading = false;
      });
    } else {
      setState(() => loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Mosque Finder')),
      body: Column(
        children: [
          Padding(
            padding: EdgeInsets.all(12),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _searchController,
                    decoration: InputDecoration(
                      hintText: 'Search city, country, or mosque name',
                      border: OutlineInputBorder(),
                      isDense: true,
                    ),
                    onSubmitted: (v) {
                      if (v.trim().isNotEmpty) {
                        searchMosques(v.trim());
                      }
                    },
                  ),
                ),
                SizedBox(width: 8),
                ElevatedButton(
                  onPressed: () async {
                    final q = _searchController.text.trim();
                    if (q.isNotEmpty) {
                      await searchMosques(q);
                    } else {
                      setState(() => loading = true);
                      final pos = await determinePosition();
                      await fetchMosques(pos.latitude, pos.longitude);
                    }
                  },
                  child: Text('Go'),
                ),
              ],
            ),
          ),
          Expanded(
            child: loading
                ? Center(child: CircularProgressIndicator())
                : ListView.builder(
                    itemCount: mosques.length,
                    itemBuilder: (context, idx) {
                      final m = mosques[idx];
                      return ListTile(
                        title: Text(m['name'] ?? 'Unnamed'),
                        subtitle: Text('${m['city'] ?? ''}, ${m['country'] ?? ''}'),
                        onTap: () => Navigator.push(
                            context,
                            MaterialPageRoute(
                                builder: (_) => MosqueDetailScreen(mosque: m))),
                      );
                    },
                  ),
          ),
        ],
      ),
    );
  }
}
