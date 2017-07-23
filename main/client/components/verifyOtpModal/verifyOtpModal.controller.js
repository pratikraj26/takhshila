'use strict';

angular.module('takhshilaApp')
  .controller('VerifyOtpModalCtrl', function ($rootScope, $mdDialog, $scope, $state, Auth) {
    $scope.verifyOTPFormData = {
      userId: null,
      otp: null
    }

    $scope.closeDialog = function() {
      $mdDialog.hide();
    };

    $scope.verifyOtp = function(verifyOTPForm){
      $scope.verifying = true;
      if(verifyOTPForm.$invalid){
        var el = angular.element("[name='" + verifyOTPForm.$name + "']").find('.ng-invalid:visible:first');
        var elName = el[0].name;
        verifyOTPForm[elName].$dirty = true;
        verifyOTPForm[elName].$pristine = false;
        angular.element("[name='" + verifyOTPForm.$name + "']").find('.ng-invalid:visible:first').focus();
        $scope.verifying = false;
        return false;
      }else{
        $scope.verifyOTPFormData.userId = $rootScope.currentUser._id;
        Auth.verifyOTP($scope.verifyOTPFormData)
        .then(function(data){
          $scope.verifying = false;
          $scope.closeDialog();
        }, function(err){
          $scope.verifying = false;
          for(var error in err.errors){
            verifyOTPForm[error].$valid = false;
            verifyOTPForm[error].$invalid = true;
            verifyOTPForm[error].$error.serverError = true;
            $scope.verifyOtpErrorMessage = err.errors[error];
            angular.element("[name='" + verifyOTPForm.$name + "'] [name='" + error + "']").focus();
          }
        })
      }
    }
  });
