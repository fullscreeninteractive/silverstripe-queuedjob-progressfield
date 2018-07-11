# SilverStripe QueuedJob Progress Field

Displays a progress bar for a [Scheduled Job](https://github.com/symbiote/silverstripe-queuedjobs).

![demo](demo.gif)

```php
use FullscreenInteractive\QueuedJobProgressField\QueuedJobProgressField;

$fields = [
    // ...
    QueuedJobProgressField::create('ScheduledJob', '', $this->ScheduledJobID)
]