package app.sypianski.kalkal

import android.os.Build
import io.flutter.embedding.android.FlutterActivity
import io.flutter.embedding.engine.FlutterEngine
import io.flutter.plugin.common.MethodChannel

class MainActivity : FlutterActivity() {
    override fun configureFlutterEngine(flutterEngine: FlutterEngine) {
        super.configureFlutterEngine(flutterEngine)
        // Flutter has no `update: slow` media query; e-ink phones and readers
        // are recognised by their maker so the e-ink look can switch on by itself.
        MethodChannel(flutterEngine.dartExecutor.binaryMessenger, "app.sypianski.kalkal/display")
            .setMethodCallHandler { call, result ->
                if (call.method == "isEink") result.success(isEinkDevice()) else result.notImplemented()
            }
    }

    private fun isEinkDevice(): Boolean {
        val id = "${Build.MANUFACTURER} ${Build.BRAND}".lowercase()
        return listOf("onyx", "boox", "bigme", "meebook", "supernote").any { id.contains(it) }
    }
}
