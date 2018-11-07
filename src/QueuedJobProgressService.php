<?php

namespace FullscreenInteractive\QueuedJobProgressField;

use Symbiote\QueuedJobs\Services\QueuedJobService;

class QueuedJobProgressService extends QueuedJobService
{
    /**
     * Make public and immediately write the results to the table.
     *
     * {@inheritDoc}
     */
    public function copyJobToDescriptor($job, $jobDescriptor)
    {
        $result = parent::copyJobToDescriptor($job, $jobDescriptor);

        $jobDescriptor->write();

        return $result;
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
