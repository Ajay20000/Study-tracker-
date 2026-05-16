#!/bin/bash
# ====================================================================
# TREBEDIT COMPACT SMART PUSH PIPELINE WITH CONDITIONAL COMMIT GUARDS
# TARGET WORKSPACE: /storage/emulated/0/GitHub /
# ====================================================================

TARGET_DIR="."

echo "🚀 Smart TrebEdit Watcher Thread Loaded Successfully!"
echo "📍 Watching Path: Internal Storage/GitHub "
echo "🎯 Focus on your study layout. Automation loop is live..."

# Continuous monitoring via native platform filesystem triggers
inotifywait -m -r -e modify -e create -e delete --format '%w%f' "$TARGET_DIR" | while read ATTACHED_FILE
do
    # Secure bypass to prevent recursive internal git tracking loops
    if [[ "$ATTACHED_FILE" == *".git"* || "$ATTACHED_FILE" == *"auto_push.sh"* ]]; then
        continue
    fi

    # Verify if any actual modifications exist inside tracker layout
    if [ -z "$(git status --porcelain)" ]; then
        # No actual code drift detected, safely bypass trigger
        continue
    fi

    echo "⚡ Code change captured at: $ATTACHED_FILE"
    echo "📦 Bundling files and executing automatic background deployment..."

    # Sequential Git automated deployment pipeline strings
    git add .
    git commit -m "Auto-sync: Incremental study layout updates compiled from Android local storage"
    git push origin main

    echo "✓ Patch successfully uploaded to GitHub repository!"
    echo "-----------------------------------------------------------------------"
done
