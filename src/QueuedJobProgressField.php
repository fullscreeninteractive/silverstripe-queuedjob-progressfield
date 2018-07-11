<?php

namespace FullscreenInteractive\QueuedJobProgressField;

use SilverStripe\Forms\FormField;
use SilverStripe\View\Requirements;
use Symbiote\QueuedJobs\Services\QueuedJob;
use Symbiote\QueuedJobs\DataObjects\QueuedJobDescriptor;

class QueuedJobProgressField extends FormField
{
    /**
     * @config
     *
     * @var int $progress_timeout (ms)
     */
    private static $progress_timeout = 5000;

    protected $jobId;

    protected $job;

    protected $schemaDataType = FormField::SCHEMA_DATA_TYPE_STRING;

    private static $allowed_actions = [
        'jobProgress'
    ];

    /**
     * @param string $name
     * @param string $title
     * @param int $jobId
     */
    public function __construct($name, $title = '', $jobId = null)
    {
        parent::__construct($name, $title);

        $this->jobId = $jobId;
    }

    /**
     * @param int $jobId
     *
     * @return $this
     */
    public function setJobId($jobId)
    {
        $this->jobId = $jobId;

        return $this;
    }

    /**
     * @inheritdoc
     *
     * @param array $properties
     *
     * @return string
     */
    public function Field($properties = array())
    {
        Requirements::javascript('//code.jquery.com/jquery-1.9.1.min.js');
        Requirements::javascript('silverstripe/admin:thirdparty/jquery-entwine/dist/jquery.entwine-dist.js');
        Requirements::javascript('fullscreeninteractive/silverstripe-queuedjob-progressfield:client/dist/js/queuedjobprogressfield.js');
        Requirements::css('fullscreeninteractive/silverstripe-queuedjob-progressfield:client/dist/styles/queuedjobprogressfield.css');

        return parent::Field($properties);
    }

    /**
     * @return QueuedJobDescriptor
     */
    public function getJob()
    {
        if (!$this->job) {
            $this->job = QueuedJobDescriptor::get()->byId($this->jobId);
        }

        return $this->job;
    }

    /**
     * @return int
     */
    public function getCheckInterval()
    {
        return (int) self::config()->get('progress_timeout');
    }

    /**
     *
     */
    public function jobProgress()
    {
        if ($job = $this->getJob()) {
            return json_encode([
                'Title' => $this->getPopoverTitle(),
                'Content' => $this->getPopoverContent(),
                'Percentage' => $this->getPercentage(),
                'Status' => $this->getStatus(),
                'Animated' => $this->isAnimated()
            ]);
        } else {
            return $this->httpError(400);
        }
    }

    /**
     * @return string
     */
    public function getCompletedSteps()
    {
        $steps = $this->job->StepsProcessed;

        if (!$steps || $steps < 0) {
            return "0";
        }

        return $steps;
    }

    /**
     * @return string
     */
    public function getTotalSteps()
    {
        return $this->job->TotalSteps;
    }

    /**
     * @return string
     */
    public function getPopoverTitle()
    {
        return ucwords($this->job->JobStatus);
    }

    /**
     * @return float
     */
    public function getPercentage()
    {
        $completed = $this->getCompletedSteps();
        $total = $this->getTotalSteps();

        if ($total < 1) {
            return '1'; // minimum 1% width
        }

        if ($completed > $total) {
            return '100';
        }

        return number_format(max(($completed / $total) * 100, 1), 2);
    }

    /**
     * @return string
     */
    public function getPopoverContent()
    {
        return sprintf('%d of %d steps complete',
            $this->getCompletedSteps(),
            $this->getTotalSteps()
        );
    }

    /**
     * @return string
     */
    public function getStatus()
    {
        if ($job = $this->getJob()) {
            switch ($job->JobStatus) {
                case QueuedJob::STATUS_NEW:
                case QueuedJob::STATUS_INIT:
                case QueuedJob::STATUS_RUN:
                    return 'bg-info';
                case QueuedJob::STATUS_WAIT:
                case QueuedJob::STATUS_PAUSED:
                    return 'bg-warning';
                case QueuedJob::STATUS_CANCELLED:
                case QueuedJob::STATUS_BROKEN;
                    return 'bg-danger';
                case QueuedJob::STATUS_COMPLETE:
                    return 'bg-success';
            }
        }
    }

    /**
     * @return boolean
     */
    public function isAnimated()
    {
        if ($job = $this->getJob()) {
            return in_array($job->JobStatus, [
                QueuedJob::STATUS_NEW,
                QueuedJob::STATUS_INIT,
                QueuedJob::STATUS_RUN,
                QueuedJob::STATUS_WAIT
            ]);
        }

        return false;
    }

    /**
     * @return $this
     */
    public function performReadonlyTransformation()
    {
        return $this;
    }
}
