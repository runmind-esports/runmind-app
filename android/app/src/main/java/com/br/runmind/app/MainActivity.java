package com.br.runmind.app;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import androidx.browser.customtabs.CustomTabsIntent;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        handleIntent(getIntent());
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        handleIntent(intent);
    }

    @Override
    public void onStart() {
        super.onStart();

        WebView webView = getBridge().getWebView();
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                // Open OAuth URLs in Chrome Custom Tab
                if (url.contains("accounts.google.com") ||
                    url.contains("strava.com/oauth")) {
                    CustomTabsIntent intent = new CustomTabsIntent.Builder().build();
                    intent.launchUrl(MainActivity.this, Uri.parse(url));
                    return true;
                }
                return false;
            }
        });
    }

    private void handleIntent(Intent intent) {
        if (intent == null || intent.getData() == null) return;

        Uri uri = intent.getData();
        String scheme = uri.getScheme();

        // Handle runmind://oauth/callback?accessToken=...&refreshToken=...
        if ("runmind".equals(scheme) && "oauth".equals(uri.getHost())) {
            String accessToken = uri.getQueryParameter("accessToken");
            String refreshToken = uri.getQueryParameter("refreshToken");
            String userId = uri.getQueryParameter("userId");
            String username = uri.getQueryParameter("username");

            if (accessToken != null && refreshToken != null) {
                // Inject tokens into WebView localStorage and navigate to callback page
                String js = String.format(
                    "localStorage.setItem('runmind_access_token', '%s');" +
                    "localStorage.setItem('runmind_refresh_token', '%s');" +
                    "localStorage.setItem('runmind_username', '%s');" +
                    "window.location.href = '/chat';",
                    accessToken, refreshToken, username != null ? username : ""
                );

                // Wait for WebView to be ready, then execute
                getBridge().getWebView().postDelayed(() -> {
                    getBridge().getWebView().evaluateJavascript(js, null);
                }, 500);
            }
        }
    }
}
