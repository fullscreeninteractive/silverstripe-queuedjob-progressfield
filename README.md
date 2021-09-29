# SilverStripe QueuedJob Progress Field

A progress bar and screen for monitoring a SilverStripe [Scheduled Job](https://github.com/symbiote/silverstripe-queuedjobs).

[![Build Status](https://travis-ci.org/fullscreeninteractive/silverstripe-queuedjob-progressfield.svg?branch=master)](https://travis-ci.org/fullscreeninteractive/silverstripe-queuedjob-progressfield)
[![Version](http://img.shields.io/packagist/v/fullscreeninteractive/silverstripe-queuedjob-progressfield.svg?style=flat)](https://packagist.org/packages/fullscreeninteractive/silverstripe-queuedjob-progressfield)
[![License](http://img.shields.io/packagist/l/fullscreeninteractive/silverstripe-queuedjob-progressfield.svg?style=flat)](LICENCE)

![demo](demo.gif)

## Installation

```
composer require fullscreeninteractive/silverstripe-queuedjob-progressfield
```

## Usage

The QueuedJobProgressField can be included in any `Form`

```php
use FullscreenInteractive\QueuedJobProgressField\QueuedJobProgressField;

$fields = [
    // ...
    QueuedJobProgressField::create('ScheduledJob', '', $this->ScheduledJobID)
];
```

This module also provides a `Controller` subclass which displays the state of
the job if needed. Setup a route to point to the `QueuedJobProgressController`

```
SilverStripe\Control\Director:
  rules:
    'upload//$Action/$ID': 'FullscreenInteractive\QueuedJobProgressField\QueuedJobProgressController'
```

Then you can redirect users to `site.com/upload/progress/<jobSignature>/<jobId>`
to see the live progress of the job.

![demo-web](demo-web.png)

## User Experience Tips

### Overriding Redirection Location

Redirecting users to `site.com/upload/progress/<jobSignature>/<jobId>` displays
a running status of the job. If the job successes, a *Continue* button for users
is activated. By default the continue button will redirect the user back, this
behaviour can be overriden by using a `ContinueLink` query param on the original
link.

```
site.com/upload/progress/<jobSignature>/<jobId>?ContinueLink=/thanks/
```

Likewise, you can set a different link for the button if the job fails, stalls
or some other error occurs.

```
site.com/upload/progress/<jobSignature>/<jobId>?FailureLink=/error/
```


## Long Running Single Progress Jobs

Due to the design of queued jobs, the progress indicator (currentStep) is only
modified in the database at the end of a `process` call. Sometimes with long
running single process jobs we need to display progress more verbosely.
`QueuedJobProgressService` is designed as a drop-in replacement for
`QueuedJobService`. The service allows your job to update the job descriptor
more frequently.

Example Job

```
use Symbiote\QueuedJobs\DataObjects\QueuedJobDescriptor;
use Symbiote\QueuedJobs\Services\AbstractQueuedJob;
use FullscreenInteractive\QueuedJobProgressField\QueuedJobProgressService;
use SilverStripe\Core\Injector\Injector;

class MyAwesomeJob extends AbstractQueuedJob
{
    protected $descriptor;

    /**
     * By default the job descriptor is only ever updated when process() is
     * finished, so for long running single tasks the user see's no process.
     *
     * This method manually updates the count values on the QueuedJobDescriptor
     */
    public function updateJobDescriptor()
    {
        if (!$this->descriptor && $this->jobDescriptorId) {
            $this->descriptor = QueuedJobDescriptor::get()->byId($this->jobDescriptorId);
        }

        // rate limit the updater to only 1 query every sec, our front end only
        // updates every 1s as well.
        if ($this->descriptor && (!$this->lastUpdatedDescriptor || $this->lastUpdatedDescriptor < (strtotime('-1 SECOND')))) {
            Injector::inst()->get(QueuedJobProgressService::class)
                ->copyJobToDescriptor($this, $this->descriptor);

            $this->lastUpdatedDescriptor = time();
        }
    }

    public function process()
    {
        $tasks = [
            // ..
        ];

        foreach ($tasks as $task) {
            $this->currentStep++;

            // sends feedback to the database in the middle of process() allowing
            // long single processes to continue.
            $this->updateJobDescriptor();
        }

        $this->isComplete = true;
    }
}
```
