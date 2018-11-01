<?php

namespace FullscreenInteractive\QueuedJobProgressField\Tests;

use SilverStripe\Dev\FunctionalTest;
use FullscreenInteractive\QueuedJobProgressField\QueuedJobProgressController;
use Symbiote\QueuedJobs\Jobs\GenerateGoogleSitemapJob;
use Symbiote\QueuedJobs\Services\QueuedJobService;

class QueuedJobProgressControllerTest extends FunctionalTest
{
    protected function getExtraRoutes()
    {
        return [
            'upload//$Action/$ID' => QueuedJobProgressController::class
        ];
    }

    public function testProgress()
    {
        $this->assertEquals(404, $this->get('upload/fail')->getStatusCode());
        $this->assertEquals(404, $this->get('upload/progress')->getStatusCode());
        $this->assertEquals(404, $this->get('upload/progress')->getStatusCode());
        $this->assertEquals(404, $this->get('upload/progress/1')->getStatusCode());
        $this->assertEquals(404, $this->get('upload/progress/1/2')->getStatusCode());

        $job = new GenerateGoogleSitemapJob();
        $id = singleton(QueuedJobService::class)->queueJob($job);

        $progress = $this->get('upload/progress/'. $job->getSignature().'/'.$id);

        $this->assertEquals(200, $progress->getStatusCode());
        $this->assertContains('Regenerate Google sitemap .xml file', $progress->getBody());
    }
}
