import 'package:flutter/material.dart';
import 'screens/home.dart';
import 'screens/mosque_detail.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Mosque Finder',
      theme: ThemeData(primarySwatch: Colors.blue),
      home: HomeScreen(),
      routes: {
        '/detail': (_) => MosqueDetailScreen(),
      },
    );
  }
}
