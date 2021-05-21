<?php

namespace FullscreenInteractive\QueuedJobProgressField;

use SilverStripe\Control\Controller;
use SilverStripe\Forms\Form;
use SilverStripe\Forms\FieldList;
use SilverStripe\View\Requirements;
use Symbiote\QueuedJobs\DataObjects\QueuedJobDescriptor;

class QueuedJobProgressController extends Controller
{
    private static $allowed_actions = [
        'progress',
        'ProgressForm'
    ];

    private static $casting = [
        'ContinueLink' => 'HTMLText',
        'FailureLink' => 'HTMLText'
    ];

    private static $url_segment = 'upload';

    public function progress()
    {
        $job = $this->getJob();

        if (!$job) {
            return $this->httpError(404);
        }

        Requirements::block('silverstripe/admin:thirdparty/jquery/jquery.js');
        Requirements::javascript('https://code.jquery.com/jquery-1.12.4.min.js');
        Requirements::javascript('fullscreeninteractive/silverstripe-queuedjob-progressfield:client/src/js/browser.js');
        Requirements::javascript('https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js');
        Requirements::javascript('https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js');
        Requirements::javascript('silverstripe/admin:thirdparty/jquery-entwine/dist/jquery.entwine-dist.js');
        Requirements::javascript('fullscreeninteractive/silverstripe-queuedjob-progressfield:client/src/js/queuedjobprogressfield.js');

        return [
            'CurrentJob' => $job
        ];
    }

    /**
     * @return \SilverStripe\Forms\Form
     */
    public function ProgressForm()
    {
        $job = $this->getJob();
        $form = Form::create($this, __FUNCTION__, FieldList::create(
            QueuedJobProgressField::create('QueuedJobProgressField', '', $job->ID)
                ->setProgressTimeout(2000)
        ), FieldList::create(

        ));

        return $form;
    }

    /**
     * @return string
     */
    public function ContinueLink()
    {
        return $this->request->getVar('ContinueLink');
    }

    /**
     * @return string
     */
    public function FailureLink()
    {
        return $this->request->getVar('FailureLink');
    }

    /**
     * @return QueuedJobDescriptor
     */
    public function getJob()
    {
        $sig = $this->request->param('ID');
        $id = $this->request->param('OtherID');

        $job = QueuedJobDescriptor::get()->filter([
            'Signature' => $sig,
            'ID' => $id
        ])->first();


        if (!$job && ($id = $this->request->requestVar('JobId'))) {
            $sig = $this->request->requestVar('JobSignature');

            $job = QueuedJobDescriptor::get()->filter([
                'Signature' => $sig,
                'ID' => $id
            ])->first();
        }

        if (!$job) {
            return false;
        }

        return $job;
    }
}
