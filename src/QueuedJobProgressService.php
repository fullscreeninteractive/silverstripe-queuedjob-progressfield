<?php

namespace FullscreenInteractive\QueuedJobProgressField;

use Symbiote\QueuedJobs\Services\QueuedJobService;

class QueuedJobProgressService extends QueuedJobService
{
    /**
     * Make public
     *
     * {@inheritDoc}
     */
    public function copyJobToDescriptor($job, $jobDescriptor)
    {
        return parent::copyJobToDescriptor($job, $jobDescriptor);
    }

    /**
     * {@inheritDoc}
     */
    public function copyDescriptorToJob($jobDescriptor, $job)
    {
        parent::copyDescriptorToJob($jobDescriptor, $job);

        $job->jobDescriptorId = $jobDescriptor->ID;
    }
}