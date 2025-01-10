import 'package:flutter/material.dart';
import 'package:flutter_displaymode/flutter_displaymode.dart';
import 'package:image_picker/image_picker.dart';
import 'package:video_player/video_player.dart';
import 'package:audioplayers/audioplayers.dart';
import 'package:file_picker/file_picker.dart';
import 'dart:io';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      home: LandingPage(),
    );
  }
}

class LandingPage extends StatefulWidget {
  @override
  _LandingPageState createState() => _LandingPageState();
}

class _LandingPageState extends State<LandingPage> {
  @override
  void initState() {
    super.initState();

    // Set the display mode to the highest available
    _setRefreshRate();
  }

  // Function to set the refresh rate to 120Hz
  void _setRefreshRate() async {
    
    // Set the highest display mode
    await FlutterDisplayMode.setHighRefreshRate();
}

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.blue,
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            CircleAvatar(
              radius: 80,
              backgroundImage: AssetImage('assets/profile_image.png'), // Replace with your image path
            ),
            SizedBox(height: 20),
            Text(
              'Your Name',
              style: TextStyle(
                color: Colors.white,
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        backgroundColor: Colors.white,
        onPressed: () {
          Navigator.push(
            context,
            PageRouteBuilder(
              pageBuilder: (context, animation, secondaryAnimation) =>
                  AddToPostScreen(),
              transitionsBuilder:
                  (context, animation, secondaryAnimation, child) {
                const begin = Offset(0.0, 1.0);
                const end = Offset.zero;
                const curve = Curves.easeInOut;

                var tween = Tween(begin: begin, end: end)
                    .chain(CurveTween(curve: curve));
                var offsetAnimation = animation.drive(tween);

                return SlideTransition(
                  position: offsetAnimation,
                  child: child,
                );
              },
            ),
          );
        },
        child: Icon(Icons.arrow_forward, color: Colors.blue),
      ),
    );
  }
}

class AddToPostScreen extends StatefulWidget {
  @override
  _AddToPostScreenState createState() => _AddToPostScreenState();
}

class _AddToPostScreenState extends State<AddToPostScreen> {
  final ImagePicker _picker = ImagePicker();
  List<PlatformFile> _selectedFiles = [];
  VideoPlayerController? _videoController;
  AudioPlayer _audioPlayer = AudioPlayer();
  bool _isPlayingVideo = false;
  bool _isPlayingAudio = false;

  Future<void> _pickVideos() async {
    final result = await FilePicker.platform.pickFiles(
      type: FileType.video,
      allowMultiple: true,
    );

    if (result != null) {
      setState(() {
        _selectedFiles.addAll(result.files);

        // Play the first video file (if selected)
        if (result.files.isNotEmpty) {
          _videoController = VideoPlayerController.file(File(result.files.first.path!))
            ..initialize().then((_) {
              setState(() {
                _isPlayingVideo = true;
                _videoController!.play();
              });
            });
        }
      });
    }
  }

Future<void> _pickAudios() async {
  final result = await FilePicker.platform.pickFiles(
    type: FileType.audio,
    allowMultiple: true,
  );

  if (result != null) {
    setState(() {
      _selectedFiles.addAll(result.files);
    });

    // Play the first audio file
    if (result.files.isNotEmpty) {
      await _audioPlayer.play(result.files.first.path! as Source); // Ensure the path is valid
      setState(() {
        _isPlayingAudio = true;
      });
    }
  }
}


  @override
  void dispose() {
    _videoController?.dispose();
    _audioPlayer.dispose();
    super.dispose();
  }

  void _proceedToNext() {
    print("Selected files: ${_selectedFiles.map((file) => file.path).toList()}");
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Column(
        children: [
          // Header
          Container(
            padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 16),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                IconButton(
                  icon: Icon(Icons.close, color: Color(0xFF111418)),
                  onPressed: () {
                    Navigator.pop(context);
                  },
                ),
                Text(
                  'Add to your post',
                  style: TextStyle(
                    color: Color(0xFF111418),
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                SizedBox(width: 24),
              ],
            ),
          ),

          // Video and Audio Options
          Container(
            padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: Color(0xFFF0F2F4),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Icon(Icons.video_library, size: 24, color: Color(0xFF111418)),
                ),
                SizedBox(width: 16),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Choose a video or audio file',
                      style: TextStyle(
                        color: Color(0xFF111418),
                        fontSize: 16,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    SizedBox(height: 4),
                    Text(
                      'You can upload up to 10 minutes of video and 512MB of audio.',
                      style: TextStyle(
                        color: Color(0xFF637588),
                        fontSize: 14,
                        fontWeight: FontWeight.normal,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),

          // Buttons
          Spacer(),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
            child: Column(
              children: [
                ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Color(0xFF1980E6),
                    minimumSize: Size(double.infinity, 48),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                  ),
                  onPressed: _pickVideos,
                  child: Text(
                    'Video',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                SizedBox(height: 8),
                ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Color(0xFFF0F2F4),
                    minimumSize: Size(double.infinity, 48),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                  ),
                  onPressed: _pickAudios,
                  child: Text(
                    'Audio',
                    style: TextStyle(
                      color: Color(0xFF111418),
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ],
            ),
          ),

          // Display Selected Files
          if (_selectedFiles.isNotEmpty) ...[
            SizedBox(height: 20),
            Expanded(
              child: ListView.builder(
                itemCount: _selectedFiles.length,
                itemBuilder: (context, index) {
                  final file = _selectedFiles[index];
                  final isVideo = file.extension == 'mp4';
                  return ListTile(
                    title: Text(file.name),
                    trailing: Icon(isVideo ? Icons.play_arrow : Icons.audiotrack),
                  );
                },
              ),
            ),
          ],

          // Next Button
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.green,
                minimumSize: Size(double.infinity, 48),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                ),
              ),
              onPressed: _proceedToNext,
              child: Text(
                'Next',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
