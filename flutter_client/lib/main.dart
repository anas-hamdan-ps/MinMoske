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
      theme: ThemeData(
        // Primary color scheme
        primarySwatch: Colors.teal,
        primaryColor: Color(0xFF00695C),
        primaryColorLight: Color(0xFF4DB6AC),
        primaryColorDark: Color(0xFF004D40),
        
        // Accent color
        colorScheme: ColorScheme.fromSeed(
          seedColor: Color(0xFF00695C),
          brightness: Brightness.light,
        ),
        
        // App bar theme
        appBarTheme: AppBarTheme(
          backgroundColor: Color(0xFF00695C),
          foregroundColor: Colors.white,
          elevation: 4,
          shadowColor: Colors.black26,
          titleTextStyle: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.w600,
            color: Colors.white,
          ),
        ),
        
        // Card theme
        cardTheme: CardThemeData(
          elevation: 2,
          shadowColor: Colors.black12,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
        ),
        
        // Input decoration theme
        inputDecorationTheme: InputDecorationTheme(
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(8),
            borderSide: BorderSide(color: Color(0xFF00695C)),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(8),
            borderSide: BorderSide(color: Color(0xFF00695C), width: 2),
          ),
          filled: true,
          fillColor: Colors.grey[50],
        ),
        
        // Elevated button theme
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            backgroundColor: Color(0xFF00695C),
            foregroundColor: Colors.white,
            elevation: 2,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(8),
            ),
            padding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          ),
        ),
        
        // List tile theme
        listTileTheme: ListTileThemeData(
          contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          tileColor: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8),
          ),
        ),
        
        // Text theme
        textTheme: TextTheme(
          titleLarge: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.w600,
            color: Color(0xFF004D40),
          ),
          bodyLarge: TextStyle(
            fontSize: 16,
            color: Color(0xFF424242),
          ),
          bodyMedium: TextStyle(
            fontSize: 14,
            color: Color(0xFF757575),
          ),
        ),
        
        // Scaffold background
        scaffoldBackgroundColor: Color(0xFFF5F5F5),
      ),
      home: HomeScreen(),
      routes: {
        '/detail': (_) => MosqueDetailScreen(),
      },
    );
  }
}
